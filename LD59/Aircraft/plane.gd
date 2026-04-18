extends Node2D

var callsign: String = "B16 CHNGS"

var altitude : float = 0.0
var target_altitude : float = 20.0

@onready var plane_body: CharacterBody2D = $PlaneBody

var move_vec : Vector2 = Vector2(-50, 0)

func change_altitude(change_by: float):
	var alt_vec = Vector2(0, -change_by)
	plane_body.translate(alt_vec)
	altitude = plane_body.position.y

func _process(delta: float) -> void:
	self.translate(move_vec * delta)
	var speed = move_vec.length()
	
	if altitude < target_altitude:
		self.change_altitude(delta * (speed / 10))
	elif altitude > target_altitude:
		self.change_altitude(-delta * (speed / 5))

func change_direction():
	self.scale.x = self.scale.x * -1
	self.move_vec.x = self.move_vec.x * -1

func _on_visible_on_screen_notifier_2d_screen_exited() -> void:
	change_direction()
	
	
