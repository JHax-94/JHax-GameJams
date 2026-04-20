class_name Aircraft extends SignalReceiver

enum Resolution {
	CRASHED = 0,
	LANDED = 1
}

signal aircraft_resolved(resolution : Aircraft.Resolution)

enum State { 
	RANDOM = 0, 
	APPROACH = 1, 
	LANDING = 2,
	IDLE = 3,
	FLYING = 4,
	TAXIING = 5,
	WAIT = 6,
	HOLDING = 7,
	NONE = -1,
	CRASHED = -2
}

const LANDED_STATES : Array[State] = [ State.IDLE, State.TAXIING ]

const LANDED_OR_LANDING_STATES : Array[State] = [ State.IDLE, State.TAXIING, State.LANDING ]

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

@export var ui_hide_time : float = 6.0

const MAX_X = 500
const MIN_X = -500

var random_x_index = randi_range(0, 1)

var approach_state : ApproachState = ApproachState.MATCH_OPPOSITE_VEC

var clear_for_landing: bool = false

var state : Aircraft.State = Aircraft.State.WAIT

var callsign: String = "B16 CHNGS"

const MAX_RAND_DIST_SQRT : float = 100

@export var speed : float = 50
var target_speed : float = 50
var speed_increment : float = 10
var accel : float = 5
@export var max_speed : float = 100
@export var min_flying_speed : float = 30
@export var taxi_speed : float = 20.0
@export var brakes : float = 8.0

@export var start_active : bool = false

@export var fuel :float = 10000.0
var max_fuel : float = self.fuel;

var turn_speed : float = 0.5
var angle_tol : float = 0.01

@export var altitude : float = 0.0
var target_altitude : float = 20.0

var min_flying_altitude : float = 20
var max_flying_altitude : float = 160

var altitude_increment : float = 10

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

var over_runway: Runway = null

@onready var track_ui: PanelContainer = $TrackUi
@onready var angle_val: Label = $TrackUi/MarginContainer/Vbox/Angle/AngleVal
@onready var callsign_label = $TrackUi/MarginContainer/Vbox/Callsign
#@onready var runway: Node2D = $"../Runway"
@onready var plane_render: AnimatedSprite2D = $PlaneBody/PlaneRender
@onready var alt_val: Label = $TrackUi/MarginContainer/Vbox/Alt/AltVal
@onready var dist_label: Label = $TrackUi/MarginContainer/Vbox/DistLabel
@onready var airspeed_val: Label = $TrackUi/MarginContainer/Vbox/Airspeed/AirspeedVal
@onready var ui_hide_timer: Timer = $UiHideTimer
@onready var plane_shadow: AnimatedSprite2D = $PlaneShadow

@onready var status_label: Label = $TrackUi/MarginContainer/Vbox/Status
@onready var clear_for_landing_label: Label = $TrackUi/MarginContainer/Vbox/ClearForLanding
@onready var plane_landing_indicator: AnimatedSprite2D = $PlaneLandingIndicator

@onready var plane_body: CharacterBody2D = $PlaneBody
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var fuel_bar: ProgressBar = $FuelBar
@onready var explosion_particles: GPUParticles2D = $ExplosionParticles
@onready var message_received: AnimatedSprite2D = $MessageReceived

var anims: Array = []
var anim_index :int = 0

var holding_pattern_radius : Message.Radius
var holding_direction : int

var move_vec : Vector2 = Vector2(-50, 0)

var layer_size : float = 5

func map_altitude_to_collision_layer():
	return floori(self.altitude / self.layer_size)
	
func map_layer_to_bitmask(layer: int) -> int:
	return floori(pow(2, layer))

func update_layers():
	if self.state == Aircraft.State.WAIT:
		self.plane_body.collision_layer = 0
		self.plane_body.collision_mask = 0
	else:
		var bitmask = self.map_layer_to_bitmask(self.map_altitude_to_collision_layer())
		self.plane_body.collision_layer = bitmask
		self.plane_body.collision_mask = bitmask

func resolve_aircraft(resolution: Aircraft.Resolution, message: String):
	if message.length() > 0:
		print(message)
	
	self.aircraft_resolved.emit(resolution)	
	match resolution:
		Resolution.CRASHED:
			print("Oh no explode!")
			self.plane_body.visible = false
			self.plane_shadow.visible = false
			self.fuel_bar.visible = false
			self.plane_landing_indicator.visible = false
			self.explosion_particles.emitting = true
			self.explosion_particles.finished.connect(func(): self.queue_free())
			self.set_state(State.CRASHED) 
		Resolution.LANDED:
			print("Bleep bloop! Plane successfully landed!")
			self.queue_free()
	


func change_altitude(change_by: float):
	var alt_vec = Vector2(0, -change_by)
	plane_body.translate(alt_vec)
	self.altitude = -plane_body.position.y
	if altitude < 0:
		self.altitude = 0
		self.plane_body.position.y = 0
		self.process_crash_land()

func dangerous_descent_speed() -> float:
	return 30.0

func process_crash_land():
	var crashed :bool = false
	if self.over_runway == null:
		print("Null Runway!")
		crashed = true
	if descent_speed > self.dangerous_descent_speed():
		print("Dangerous descent speed!")
		print(descent_speed)
		crashed = true

	if crashed:
		self.resolve_aircraft(Resolution.CRASHED, "CRASH LANDED")
	

func change_fuel(change_by: float):
	self.fuel += change_by
	if self.fuel > self.max_fuel:
		self.fuel = self.max_fuel
	elif self.fuel < 0:
		self.fuel = 0
	
	self.fuel_bar.value = self.fuel

func update_indicator_visibility():
	self.plane_landing_indicator.visible = self.clear_for_landing and self.in_state(self.LANDED_STATES) == false

func set_state(set_to : State):
	self.state = set_to
	self.update_indicator_visibility()

func set_approach_state(set_to: ApproachState):
	if self.approach_state != set_to:
		print("Set " + self.name + " approach state to: " + self.approach_state_str(set_to))
		self.approach_state = set_to

func set_altitude(set_to: float):
	self.altitude = set_to
	self.target_altitude = set_to
	plane_body.position.y = -set_to

func teleport_to_approach():
	self.global_position = target_approach.global_position
	
	var approach_vec: Vector2 = self.target_runway.approach_vector(target_approach)
	plane_body.look_at(target_approach.global_position + approach_vec)
	self.set_state(Aircraft.State.NONE)

func set_over_runway(runway: Runway):
	print(self.name + " over runway " + runway.name)
	self.over_runway = runway
	
func left_runway(runway: Runway):
	print(self.name + " no longer over runway " + runway.name)
	self.over_runway = null
	if self.altitude <= 0 and self.state != State.TAXIING:
		self.resolve_aircraft(Resolution.CRASHED, "OVERRAN RUNWAY!")
	
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

func in_state(state_list: Array[Aircraft.State]):
	return state_list.find(self.state) >= 0

func random_sign():
	var roll = randi_range(0, 1)
	if roll == 0:
		roll = -1
	return roll

func set_clear_for_landing(_clear_for_landing: bool):
	self.clear_for_landing = _clear_for_landing
	self.update_indicator_visibility()

func acknowledge_message():
	self.message_received.visible = true
	self.message_received.play()

func message(message_data: Message):
	print("Aircraft " + self.callsign + " receiving message: " + message_data.description)
	if self.state != State.CRASHED:
		if self.in_state(self.LANDED_STATES) == false:
			match message_data.type:
				Message.Type.ABORT:
					self.set_state(Aircraft.State.RANDOM)
					self.set_clear_for_landing(false)
					if self.target_altitude < self.min_flying_altitude:
						self.target_altitude = self.min_flying_altitude
					self.new_random_target()
					self.acknowledge_message()

		if self.in_state(self.LANDED_OR_LANDING_STATES) == false:
			match message_data.type:
				Message.Type.BEGIN_APPROACH:
					var approachMessage = message_data as ApproachMessage
					target_approach = approachMessage.approach
					target_runway = approachMessage.runway
					self.set_state(Aircraft.State.APPROACH)
					self.set_approach_state(ApproachState.ENSURE_DISTANCE)
					self.acknowledge_message()
				Message.Type.CLEAR_FOR_LANDING:
					self.set_clear_for_landing(true)
					self.acknowledge_message()
				Message.Type.HOLDING_PATTERN:
					var holding_message = message_data as HoldingPatternMessage
					self.set_state(Aircraft.State.HOLDING)
					self.holding_pattern_radius = holding_message.radius
					self.holding_direction = self.random_sign()
					self.acknowledge_message()
				Message.Type.CHANGE_ALTITUDE:
					var change_alt = message_data as ChangeAltitudeMessage
					if change_alt.direction == Message.Direction.INCREASE:
						self.change_target_altitude(self.altitude_increment)
					else:
						self.change_target_altitude(-self.altitude_increment)
					self.acknowledge_message()
				Message.Type.CHANGE_SPEED:
					var change_speed_message = message_data as ChangeSpeedMessage
					if change_speed_message.direction == Message.Direction.INCREASE:
						self.change_target_speed(self.speed_increment)
					else:
						self.change_target_speed(-self.speed_increment)
					self.acknowledge_message()

		if self.in_state([ State.IDLE ]):
			match message_data.type:
				Message.Type.TAXI:
					self.follow_taxi_path = self.target_approach.taxi_path
					self.taxi_node = self.follow_taxi_path.first_node()
					self.follow_taxi_path.node_reached.connect(taxi_node_reached)
					self.follow_taxi_path.hangar_reached.connect(hangar_reached)
					self.set_state(State.TAXIING)
					self.acknowledge_message()

func change_target_altitude(change_by: float):
	self.target_altitude += change_by
	if self.target_altitude > self.max_flying_altitude:
		self.target_altitude = self.max_flying_altitude
	elif self.target_altitude < self.min_flying_altitude:
		self.target_altitude = self.min_flying_altitude

func change_target_speed(change_by: float):
	self.target_speed += change_by
	if(self.target_speed > self.max_speed):
		self.target_speed = self.max_speed
	elif self.target_speed < self.min_flying_speed:
		self.target_speed = self.min_flying_speed

func change_speed(change_by: float, delta: float):
	var increment = change_by * delta
	
	if increment > 0 and self.speed + increment > self.target_speed:
		self.speed = self.target_speed
	elif increment < 0 and self.speed + increment < self.target_speed:
		self.speed = self.target_speed
	else:
		self.speed += increment

func taxi_node_reached(waypoint: Area2D, body: Node2D):
	print("Plane receiving taxi notification")
	if body == self.plane_body and waypoint == self.taxi_node:
		print("Next taxi node")
		self.taxi_node = self.follow_taxi_path.next_node(self.taxi_node)

func hangar_reached(body: Node2D):
	if body == self.plane_body:
		self.resolve_aircraft(Resolution.LANDED, "REACHED HANGAR SAFELY!")

func _ready() -> void:
	self.max_fuel = self.fuel
	var anim_list = self.animation_player.get_animation_list()
	self.plane_landing_indicator.play()
	
	self.target_speed = self.speed
	
	if self.start_active:
		self.set_state(Aircraft.State.RANDOM)
	
	self.atc = get_tree().root.find_child("atc_tower") as AtcTower
	self.fuel_bar.max_value = self.max_fuel
	self.fuel_bar.value = self.fuel
	
	self.callsign_label.text = self.callsign
	
	self.set_altitude(self.altitude)
	
	for anim in anim_list:
		if anim != "RESET":
			#print("Plane anims:" + anim)
			self.anims.append(anim)

func effective_approach_state() -> ApproachState:
	var return_state = ApproachState.NONE
	
	if self.state == State.APPROACH:
		return_state = self.approach_state
	
	return return_state

func approach_state_str(appr_state : ApproachState):
	var _str = ""
	match appr_state:
		ApproachState.NONE:
			_str += "None"
		ApproachState.MATCH_VEC:
			_str += "MatchVec"
		ApproachState.MATCH_OPPOSITE_VEC:
			_str += "MatchReverse"
		ApproachState.ENSURE_DISTANCE:
			_str += "EnsureDist"
		ApproachState.REACH_APPROACH:
			_str += "ReachApproach"
		ApproachState.LANDING_VECTOR:
			_str += "LandingVec"
		_:
			_str += "Unknown"
			
	return _str

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
			
			status_string += self.approach_state_str(self.approach_state)
			
			if self.target_runway:
				status_string += self.target_runway.name
			if self.target_approach:
				status_string += self.target_approach.name
					
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
	var moving_against_landing_vec : bool = dot < 0
	
	var perp_comp = perp_vec.normalized().dot(vec_from_approach)
	var perp_dist = absf(perp_comp)
	self.dist_label.text = str(perp_dist) + "/" + str(self.min_approach_dist())
	
	var not_matching_or_matched_vector : bool = self.approach_state != ApproachState.LANDING_VECTOR and self.approach_state != ApproachState.MATCH_VEC
	
	if (self.approach_state == ApproachState.ENSURE_DISTANCE or (not_matching_or_matched_vector and moving_against_landing_vec)) and perp_dist < min_approach_dist():
		var angle = self.plane_body.get_angle_to(self.target_approach.global_position + self.min_approach_dist() * perp_vec)
		angle = self.clamp_to_turn_speed(angle, delta)
		self.plane_body.rotate(angle)
		self.dist_label.text = "TOO CLOSE! " + str(perp_comp)
	else:
		self.dist_label.text = "GOOD RANGE!"
		if self.approach_state != ApproachState.MATCH_VEC and self.approach_state != ApproachState.LANDING_VECTOR:
			if dot < 0:
				self.set_approach_state(ApproachState.MATCH_OPPOSITE_VEC)
			else:
				self.set_approach_state(ApproachState.REACH_APPROACH)
		
		#print("DOT: " + str(dot))
		if self.approach_state == ApproachState.REACH_APPROACH:
			#print("Target vec: " + str(perp_vec) + "("  + str(perp_comp) + ")")
			
			var angle = self.plane_body.get_angle_to(self.plane_body.global_position - perp_comp * perp_vec)
			angle = self.clamp_to_turn_speed(angle, delta)
			self.plane_body.rotate(angle)
			
			#print(str(perp_dist) + " / " + str(self.turn_radius()))
			
			if perp_dist < self.turn_radius():
				print("MATCH VEC!")
				self.set_approach_state(ApproachState.MATCH_VEC)
			
		elif self.approach_state == ApproachState.MATCH_VEC:
			var angle = self.plane_body.get_angle_to(self.plane_body.global_position + approach_vec)
			if absf(angle) <= absf(self.turn_speed * delta):
				print("SNAP TO VEC")
				self.plane_body.look_at(self.plane_body.global_position + approach_vec)
				self.set_approach_state(ApproachState.LANDING_VECTOR)
				if self.clear_for_landing:
					self.set_state(State.LANDING)
			else:
				angle = self.clamp_to_turn_speed(angle, delta)
				self.plane_body.rotate(angle)
		elif self.approach_state == ApproachState.MATCH_OPPOSITE_VEC:
			#print("MATCHING OPPOSITE VEC...")
			var angle = self.plane_body.get_angle_to(self.plane_body.global_position - approach_vec)
			#print(str(angle))
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
		self.speed = taxi_speed * 0.5
		angle = self.clamp_to_turn_speed(angle, delta)
		self.plane_body.rotate(angle)
		step = "Turn..."
		
	self.dist_label.text = self.taxi_node.name + " " + step

func move_at_speed(_speed: float, delta: float):
	var velocity = _speed * delta * self.plane_body.global_transform.basis_xform(Vector2.RIGHT)
		#print("(" + str(velocity.x) + ", " + str(velocity.y) + ")")
	self.translate(velocity)
	var collision: KinematicCollision2D = self.plane_body.move_and_collide(velocity, true)
	if collision:
		self.resolve_aircraft(Resolution.CRASHED, "HIT OTHER AIRCRAFT!")
		var collider = collision.get_collider() as Node2D
		var aircraft : Aircraft = null
		if collider:
			aircraft = collider.get_parent() as Aircraft
		
		if aircraft:
			aircraft.resolve_aircraft(Resolution.CRASHED, "HIT BY OTHER AIRCRAFT!")
		print("Collision with: " + collider.name)
		
	else:
		self.angle_val.text = "No collision..."
	
	
func process_no_fuel_movement(delta: float):
	self.speed += self.air_braking(delta)
	self.move_at_speed(self.speed, delta)
	if self.altitude > 0:
		self.descent_speed += self.gravity * delta
		self.change_altitude(-self.descent_speed * delta)

func process_speed_change(delta: float):
	if self.speed < self.target_speed:
		self.change_speed(self.accel, delta)
	elif self.speed > self.target_speed:
		self.change_speed(-self.accel, delta)

func process_controlled_altitude_change(delta: float):
	if altitude < target_altitude:
		self.change_altitude(delta * (speed / 10))
	elif altitude > target_altitude:
		self.change_altitude(self.air_braking(delta))

func process_standard_movement(delta: float):
	
	if fuel > 0:
		self.move_at_speed(self.speed, delta)
		self.change_fuel(-self.speed * delta)
	
		if(self.state != State.LANDING):
			self.process_speed_change(delta)
		
		self.process_controlled_altitude_change(delta)
		
	else:
		self.process_no_fuel_movement(delta)
	
	if self.altitude > 0:
		if self.speed < self.min_flying_speed:
			self.descent_speed += self.gravity * delta
			self.change_altitude(-self.descent_speed * delta)
	
	
	
func process_holding(delta):
	var angle_base = self.turn_speed
	
	if self.holding_pattern_radius == Message.Radius.WIDE:
		angle_base = self.turn_speed * 0.5

	var angle = self.holding_direction * angle_base * delta
	self.plane_body.rotate(angle)


func _process(delta: float) -> void:
	if self.state != State.CRASHED:
		self.dist_label.text = ""
		if state == Aircraft.State.WAIT:
			pass
		else:
			if state == Aircraft.State.APPROACH:
				self.process_approach(delta)
			elif state == Aircraft.State.LANDING:
				if self.target_altitude > 0:
					self.target_altitude = 0
					
				if self.altitude > 0:
					self.speed += self.air_braking(delta)
				else:
					#print("BRAKES!")
					self.speed += self.land_braking(delta)
					
				if self.speed < 0:
					self.speed = 0
					self.set_state(State.IDLE)
			elif self.state == State.IDLE:
				self.speed = 0
			elif self.state == State.TAXIING:
				self.process_taxi(delta)
			elif self.state == State.HOLDING:
				self.process_holding(delta)
			else:	
				self.process_default(delta)
			
			self.process_standard_movement(delta)
			
			self.lock_rotations()
			
			self.process_animation()
			self.update_status_label()
		
		self.update_layers()

func lock_rotations():
	self.plane_render.global_rotation = 0.0
	self.fuel_bar.position.y = -20 - self.altitude
	self.plane_landing_indicator.position.y = -18 -self.altitude
	self.track_ui.position.y = 20 - self.altitude
	self.message_received.position.y = -22 - self.altitude

func approach_reached():
	print("Approach reached!")

func process_animation():
	var angle = self.plane_body.transform.get_rotation()
	
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
	
	#self.angle_val.text = str(angle/PI) + "PI"
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
	

func in_range():
	self.track_ui.visible = true
	self.ui_hide_timer.stop()
	
func out_of_range():
	self.ui_hide_timer.start(self.ui_hide_time)

func _on_visible_on_screen_notifier_2d_screen_exited() -> void:
	if self.state == State.RANDOM:
		new_random_target()
	
func _on_wait_timer_timeout() -> void:
	print("Wait timer timeout on " + self.name)
	if self.state == Aircraft.State.WAIT:
		print("Start plane: " + self.name)
		self.set_state(Aircraft.State.RANDOM)


func _on_ui_hide_timer_timeout() -> void:
	self.track_ui.visible = false


func _on_message_received_animation_looped() -> void:
	self.message_received.visible = false
	self.message_received.stop()
