class_name Aircraft extends SignalReceiver

enum State { 
	RANDOM = 0, 
	APPROACH = 1, 
	LANDING = 2,
	IDLE = 3,
	FLYING = 4,
	TAXIING = 5,
	NONE = -1 
}

enum ApproachState { 
	NONE = -1, 
	MATCH_VEC = 0, 
	MATCH_OPPOSITE_VEC = 1, 
	ENSURE_DISTANCE = 2, 
	REACH_APPROACH = 3, 
	LANDING_VECTOR = 4 
}

@export var random_x : Array[float] = [ -600, 600 ]

@export var random_y_min: float = -400.0
@export var random_y_max: float = 400.0

const MAX_X = 500
const MIN_X = -500

var random_x_index = randi_range(0, 1)

var approach_state : ApproachState = ApproachState.MATCH_OPPOSITE_VEC

var clear_for_landing: bool = false

var state = Aircraft.State.RANDOM

var callsign: String = "B16 CHNGS"

const MAX_RAND_DIST_SQRT : float = 100

@export var speed : float = 50
@export var max_speed : float = 50
@export var taxi_speed : float = 10
@export var brakes : float = 8.0

@export var fuel :float = 10000.0
var max_fuel : float = self.fuel;

var turn_speed : float = 0.5
var angle_tol : float = 0.01

@export var altitude : float = 0.0
var target_altitude : float = 20.0

@export var target_position: Vector2
var target_approach: Approach
var target_angle: float

var gravity:float = 9.8
var descent_speed :float = 0.0

var target_runway : Runway

var timer:float = 0.0;

var y_log: Array = []

var atc : AtcTower

var follow_taxi_path : TaxiPath
var taxi_node: Node2D

var angle_sweep = 0.0;

@onready var angle_val: Label = $PanelContainer/Vbox/Angle/AngleVal
@onready var runway: Node2D = $"../Runway"
@onready var plane_render: AnimatedSprite2D = $PlaneBody/PlaneRender
@onready var alt_val: Label = $PanelContainer/Vbox/Alt/AltVal
@onready var dist_label: Label = $PanelContainer/Vbox/DistLabel
@onready var airspeed_val: Label = $PanelContainer/Vbox/Airspeed/AirspeedVal

@onready var status_label: Label = $PanelContainer/Vbox/Status
@onready var clear_for_landing_label: Label = $PanelContainer/Vbox/ClearForLanding

@onready var plane_body: CharacterBody2D = $PlaneBody
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var fuel_bar: ProgressBar = $PlaneBody/FuelBar



var anims: Array = []
var anim_index :int = 0

var move_vec : Vector2 = Vector2(-50, 0)

func change_altitude(change_by: float):
	var alt_vec = Vector2(0, -change_by)
	plane_body.translate(alt_vec)
	self.altitude = -plane_body.position.y
	if altitude < 0:
		self.altitude = 0
		self.plane_body.position.y = 0
		if abs(descent_speed) > 0:
			print("Oh no explode!")
			queue_free()

func change_fuel(change_by: float):
	self.fuel += change_by
	if self.fuel > self.max_fuel:
		self.fuel = self.max_fuel
	elif self.fuel < 0:
		self.fuel = 0
	
	self.fuel_bar.value = self.fuel

func set_altitude(set_to: float):
	self.altitude = set_to
	plane_body.position.y = -set_to

func teleport_to_approach():
	self.global_position = target_approach.global_position
	
	var approach_vec: Vector2 = self.target_runway.approach_vector(target_approach)
	plane_body.look_at(target_approach.global_position + approach_vec)
	self.state = Aircraft.State.NONE
	
	
func clamp_to_turn_speed(angle, delta) -> float:
	if angle > delta * self.turn_speed:
		angle = delta * self.turn_speed
	elif angle < -delta * self.turn_speed:
		angle = -delta * self.turn_speed
	return angle
		
func air_braking(delta):
	return -delta * self.speed / 10
	
func land_braking(delta):
	return -delta * self.brakes

func turn_radius() -> float:
	return self.speed / self.turn_speed

func min_approach_dist() -> float:
	return 2 * self.turn_radius()

func message(message_data: Message):
	print("Aircraft " + self.callsign + " receiving message: " + message_data.description)
	
	match message_data.type:
		Message.Type.BEGIN_APPROACH:
			var approachMessage = message_data as ApproachMessage
			target_approach = approachMessage.approach
			target_runway = approachMessage.runway
			self.state = Aircraft.State.APPROACH
		Message.Type.CLEAR_FOR_LANDING:
			self.clear_for_landing = true
			self.clear_for_landing_label.visible = true
		Message.Type.TAXI:
			if self.state == State.IDLE:
				self.follow_taxi_path = self.target_approach.taxi_path
				self.taxi_node = self.follow_taxi_path.first_node()
				self.follow_taxi_path.node_reached.connect(taxi_node_reached)
				self.follow_taxi_path.hangar_reached.connect(hangar_reached)
				self.state = State.TAXIING

func taxi_node_reached(waypoint: Area2D, body: Node2D):
	print("Plane receiving taxi notification")
	if body == self.plane_body and waypoint == self.taxi_node:
		print("Next taxi node")
		self.taxi_node = self.follow_taxi_path.next_node(self.taxi_node)

func hangar_reached(body: Node2D):
	if body == self.plane_body:
		print("Bleep bloop! Plane successfully landed!")
		queue_free()




func _ready() -> void:
	var anim_list = self.animation_player.get_animation_list()
	
	self.atc = get_tree().root.find_child("atc_tower") as AtcTower
	self.fuel_bar.max_value = self.max_fuel
	self.fuel_bar.value = self.fuel
	
	self.set_altitude(self.altitude)
	
	for anim in anim_list:
		if anim != "RESET":
			print("Plane anims:" + anim)
			self.anims.append(anim)

func set_approach_state(_approach_state: ApproachState):
	print("Set approach state: " + str(_approach_state))
	self.approach_state = _approach_state

func effective_approach_state() -> ApproachState:
	var return_state = ApproachState.NONE
	
	if self.state == State.APPROACH:
		return_state = self.approach_state
	
	return return_state

func update_status_label() ->void:
	var status_string = ""
	
	match self.state:
		State.RANDOM:
			status_string = "Random"
		State.NONE:
			status_string = "None"
		State.LANDING:
			status_string = "Landing"
		State.TAXIING:
			status_string = "Taxi"
		State.APPROACH:
			status_string = "Approach:"
			match self.approach_state:
				ApproachState.NONE:
					status_string += "None"
				ApproachState.MATCH_VEC:
					status_string += "MatchVec"
				ApproachState.MATCH_OPPOSITE_VEC:
					status_string += "MatchReverse"
				ApproachState.ENSURE_DISTANCE:
					status_string += "EnsureDist"
				ApproachState.REACH_APPROACH:
					status_string += "ReachApproach"
				ApproachState.LANDING_VECTOR:
					status_string += "LandingVec"
				_:
					status_string += "Unknown"
					
	self.status_label.text = status_string
	

func process_random(delta: float) -> void:
	#self.translate(move_vec * delta)
	
	var diff_vec = self.atc.global_position - self.global_position
	
	if diff_vec.length_squared() > pow(self.MAX_RAND_DIST_SQRT, 2):
		print("Recalculate target")
		
	self.plane_body.rotate(-delta * self.turn_speed)
	
	angle_sweep += delta * self.turn_speed;
	if angle_sweep > PI:
		y_log.append(self.global_position.y)
		print("--- YLOG --- ")
		for y in y_log:
			print(y)
		angle_sweep -= PI

func process_approach(delta: float) -> void:
	var approach_vec = self.target_runway.approach_vector(self.target_approach)
	#print(approach_vec)
	var perp_vec = self.target_runway.perpendicular_vector(self.target_approach)
	
	var vec_from_approach = self.plane_body.global_position - target_approach.global_position
	
	var dot = approach_vec.dot(-vec_from_approach);
	var perp_comp = perp_vec.normalized().dot(vec_from_approach)
	var perp_dist = absf(perp_comp)
	self.dist_label.text = str(perp_dist) + "/" + str(self.min_approach_dist())
	
	if self.approach_state != ApproachState.LANDING_VECTOR and self.approach_state != ApproachState.MATCH_VEC and dot < 0 and perp_dist < min_approach_dist():
		var angle = self.plane_body.get_angle_to(self.target_approach.global_position + self.min_approach_dist() * perp_vec)
		angle = self.clamp_to_turn_speed(angle, delta)
		self.plane_body.rotate(angle)
		self.dist_label.text = "TOO CLOSE! " + str(perp_comp)
	else:
		self.dist_label.text = "GOOD RANGE!"
		if self.approach_state != ApproachState.MATCH_VEC and self.approach_state != ApproachState.LANDING_VECTOR:
			if dot < 0:
				self.approach_state = ApproachState.MATCH_OPPOSITE_VEC
			else:
				self.approach_state = ApproachState.REACH_APPROACH
		
		#print("DOT: " + str(dot))
		if self.approach_state == ApproachState.REACH_APPROACH:
			print("Target vec: " + str(perp_vec) + "("  + str(perp_comp) + ")")
			
			var angle = self.plane_body.get_angle_to(self.plane_body.global_position - perp_comp * perp_vec)
			angle = self.clamp_to_turn_speed(angle, delta)
			self.plane_body.rotate(angle)
			
			print(str(perp_dist) + " / " + str(self.turn_radius()))
			
			if perp_dist < self.turn_radius():
				print("MATCH VEC!")
				self.approach_state = ApproachState.MATCH_VEC
			
		elif self.approach_state == ApproachState.MATCH_VEC:
			var angle = self.plane_body.get_angle_to(self.plane_body.global_position + approach_vec)
			if absf(angle) <= absf(self.turn_speed * delta):
				print("SNAP TO VEC")
				self.plane_body.look_at(self.plane_body.global_position + approach_vec)
				approach_state = ApproachState.LANDING_VECTOR
				if self.clear_for_landing:
					self.state = State.LANDING
			else:
				angle = self.clamp_to_turn_speed(angle, delta)
				self.plane_body.rotate(angle)
		elif self.approach_state == ApproachState.MATCH_OPPOSITE_VEC:
			print("MATCHING OPPOSITE VEC...")
			var angle = self.plane_body.get_angle_to(self.plane_body.global_position - approach_vec)
			print(str(angle))
			angle = self.clamp_to_turn_speed(angle, delta)
			self.plane_body.rotate(angle)

func process_default(delta: float) -> void:
	var angle = self.plane_body.get_angle_to(target_position)
	angle = self.clamp_to_turn_speed(angle, delta)
	#print(diff)
	self.plane_body.rotate(angle)
	if self.global_position.x > MAX_X and self.target_position.x > self.global_position.x:
		self.new_random_target()
	elif self.global_position.x < MIN_X and self.target_position.x < self.global_position.x:
		self.new_random_target()

func process_taxi(delta: float) -> void:
	
	var step = ""
	var angle = self.plane_body.get_angle_to(self.taxi_node.global_position)
	if abs(angle) < angle_tol:
		self.speed = taxi_speed
		step = "Straight on!"
	else:
		self.speed = taxi_speed
		angle = self.clamp_to_turn_speed(angle, delta)
		self.plane_body.rotate(angle)
		step = "Turn..."
		
	self.dist_label.text = self.taxi_node.name + " " + step

func move_at_speed(_speed: float, delta: float):
	var velocity = _speed * delta * self.plane_body.global_transform.basis_xform(Vector2.RIGHT)
		#print("(" + str(velocity.x) + ", " + str(velocity.y) + ")")
	self.translate(velocity)

func process_standard_movement(delta: float):
	if fuel > 0:
		self.move_at_speed(self.speed, delta)
		self.change_fuel(-self.speed * delta)
		
		if altitude < target_altitude:
			self.change_altitude(delta * (speed / 10))
		elif altitude > target_altitude:
			self.change_altitude(self.air_braking(delta))
	
	else:
		self.speed += self.air_braking(delta)
		self.move_at_speed(self.speed, delta)
		self.descent_speed += self.gravity * delta
		self.change_altitude(-self.descent_speed * delta)

func _process(delta: float) -> void:
	
	self.dist_label.text = ""
	
	if state == Aircraft.State.APPROACH:
		self.process_approach(delta)
	elif state == Aircraft.State.LANDING:
		if self.target_altitude > 0:
			self.target_altitude = 0
			
		if self.altitude > 0:
			self.speed += self.air_braking(delta)
		else:
			print("BRAKES!")
			self.speed += self.land_braking(delta)
			
		if self.speed < 0:
			self.speed = 0
			self.state = State.IDLE
	elif self.state == State.IDLE:
		self.speed = 0
	elif self.state == State.TAXIING:
		self.process_taxi(delta)
	else:	
		self.process_default(delta)
	
	self.process_standard_movement(delta)
	
	self.lock_rotations()
	
	self.process_animation()
	self.update_status_label()

func lock_rotations():
	self.plane_render.global_rotation = 0.0
	self.fuel_bar.rotation = -self.plane_body.rotation


func approach_reached():
	print("Approach reached!")

func process_animation():
	var angle = self.plane_body.transform.get_rotation()
	var angle_bound = PI / 8
	
	if angle > -PI/8  and angle < PI/8:
		self.animation_player.play("Right")
	elif angle > PI/8 and angle < 3*PI/8:
		self.animation_player.play("RightDown")
	elif angle > 3*PI/8 and angle < 5*PI/8:
		self.animation_player.play("Down")
	elif angle > 5 * PI/8 and angle < 7 * PI/8:
		self.animation_player.play("LeftDown")
	elif angle > 7 * PI / 8 or angle < - 7 * PI/8:
		self.animation_player.play("Left")
	elif angle < -PI/8 and angle > -3*PI/8:
		self.animation_player.play("RightUp")
	elif angle < - 3* PI/8 and angle > -5* PI /8:
		self.animation_player.play("Up")
	elif angle < -5*PI/8 and angle > -7 * PI / 8:
		self.animation_player.play("LeftUp")
	
	self.angle_val.text = str(angle/PI) + "PI"
	self.alt_val.text = str(roundi(self.altitude * 10)) + "m"
	self.airspeed_val.text = str(roundi(self.speed)) + " knots"

func flip_direction():
	self.plane_body.rotate(PI)

func new_random_target():
	print("Find new random target")
	self.random_x_index = (self.random_x_index + 1) % self.random_x.size()
	
	var rand_y = randf_range(self.random_y_min, self.random_y_max)
	self.target_position = Vector2(self.random_x[self.random_x_index], rand_y)
	print(str(self.target_position))
	

func _on_visible_on_screen_notifier_2d_screen_exited() -> void:
	if self.state == State.RANDOM:
		new_random_target()
	
	
	
