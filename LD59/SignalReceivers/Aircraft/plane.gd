class_name Aircraft extends SignalReceiver

enum State { RANDOM = 0, APPROACH = 1, NONE = -1 }

enum ApproachState { MATCH_VEC = 0, MATCH_OPPOSITE_VEC = 1, ENSURE_DISTANCE = 2, REACH_APPROACH = 3, LANDING_VECTOR = 4 }

var approach_state : ApproachState = ApproachState.MATCH_OPPOSITE_VEC

var state = Aircraft.State.NONE

var callsign: String = "B16 CHNGS"

var speed : float = 50

var turn_speed : float = 0.5
var angle_tol : float = 0.01

var altitude : float = 0.0
var target_altitude : float = 20.0

var target_position: Vector2
var target_approach: Node2D
var target_angle: float

var target_runway : Runway

var timer:float = 0.0;

var y_log: Array = []


var angle_sweep = 0.0;

@onready var angle_val: Label = $PanelContainer/Vbox/Angle/AngleVal
@onready var runway: Node2D = $"../Runway"
@onready var plane_render: AnimatedSprite2D = $PlaneBody/PlaneRender
@onready var alt_val: Label = $PanelContainer/Vbox/Alt/AltVal
@onready var dist_label: Label = $PanelContainer/Vbox/DistLabel


@onready var plane_body: CharacterBody2D = $PlaneBody
@onready var animation_player: AnimationPlayer = $AnimationPlayer
var anims: Array = []
var anim_index :int = 0

var move_vec : Vector2 = Vector2(-50, 0)

func change_altitude(change_by: float):
	var alt_vec = Vector2(0, -change_by)
	plane_body.translate(alt_vec)
	altitude = -plane_body.position.y

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
		

func turn_radius() -> float:
	return self.speed / self.turn_speed

func min_approach_dist() -> float:
	return 2 * self.turn_radius()

func message(message_data: Message):
	print("Aircraft " + self.callsign + " receiving message: " + message_data.description)
	
	if message_data.type == Message.Type.BEGIN_APPROACH:
		var approachMessage = message_data as ApproachMessage
		var approach = approachMessage.runway.approach_points[1] as Node2D
		target_position = approach.global_position
		target_approach = approach
		target_runway = approachMessage.runway
		self.state = Aircraft.State.APPROACH

func _ready() -> void:
	var anim_list = self.animation_player.get_animation_list()
	
	for anim in anim_list:
		if anim != "RESET":
			print("Plane anims:" + anim)
			self.anims.append(anim)


func _process(delta: float) -> void:
	
	self.dist_label.text = ""
	
	if state == Aircraft.State.RANDOM:
		
		#self.translate(move_vec * delta)
		self.plane_body.rotate(-delta * self.turn_speed)
		
		angle_sweep += delta * self.turn_speed;
		if angle_sweep > PI:
			y_log.append(self.global_position.y)
			print("--- YLOG --- ")
			for y in y_log:
				print(y)
			angle_sweep -= PI
		
		
		
	elif state == Aircraft.State.APPROACH:
		
		var approach_vec = self.target_runway.approach_vector(self.target_approach)
		#print(approach_vec)
		
		var perp_vec = self.target_runway.perpendicular_vector(self.target_approach)
		
		var vec_from_approach = self.plane_body.global_position - target_approach.global_position
		
		var dot = approach_vec.dot(-vec_from_approach);
		var perp_comp = perp_vec.normalized().dot(vec_from_approach)
		var perp_dist = absf(perp_comp)
		self.dist_label.text = str(perp_dist) + "/" + str(self.min_approach_dist())
		
		if self.approach_state != ApproachState.LANDING_VECTOR and dot < 0 and perp_dist < min_approach_dist():
			var angle = self.plane_body.get_angle_to(self.target_approach.global_position)
			angle = self.clamp_to_turn_speed(-angle, delta)
			self.plane_body.rotate(angle)
			#self.dist_label.text = "TOO CLOSE!"
		else:
			#self.dist_label.text = "GOOD RANGE!"
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
				angle = self.clamp_to_turn_speed(angle, delta)
				if absf(angle) < absf(self.turn_speed * delta):
					print("SNAP TO VEC")
					self.plane_body.look_at(self.plane_body.global_position + approach_vec)
					approach_state = ApproachState.LANDING_VECTOR
				else:
					self.plane_body.rotate(angle)
			elif self.approach_state == ApproachState.MATCH_OPPOSITE_VEC:
				
				var angle = self.plane_body.get_angle_to(self.plane_body.global_position - approach_vec)
				angle = self.clamp_to_turn_speed(angle, delta)
				self.plane_body.rotate(angle)

	else:	
		var angle = self.plane_body.get_angle_to(target_position)
		var diff = angle_difference(self.plane_body.rotation, angle)
		#print(diff)
		if diff > self.angle_tol:
			self.plane_body.rotate(delta * self.turn_speed)
		elif diff < -self.angle_tol:
			self.plane_body.rotate(- delta * self.turn_speed)
		
	var velocity = self.speed * delta * plane_body.global_transform.basis_xform(Vector2.RIGHT)
	#print("(" + str(velocity.x) + ", " + str(velocity.y) + ")")
	
	self.translate(velocity)
	
	if altitude < target_altitude:
		self.change_altitude(delta * (speed / 10))
	elif altitude > target_altitude:
		self.change_altitude(-delta * (speed / 5))
	
	self.plane_render.global_rotation = 0.0
	self.process_animation()

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
	self.alt_val.text = str(self.altitude)

func flip_direction():
	self.plane_body.rotate(PI)

func _on_visible_on_screen_notifier_2d_screen_exited() -> void:
	#flip_direction()
	pass
	
	
