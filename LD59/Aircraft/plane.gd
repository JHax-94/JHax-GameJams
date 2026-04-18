extends Node2D

var callsign: String = "B16 CHNGS"

var move_vec : Vector2 = Vector2(-50, 0)

func _process(delta: float) -> void:
	self.translate(move_vec * delta)


func _on_visible_on_screen_notifier_2d_screen_exited() -> void:
	self.move_vec.x = self.move_vec.x * -1;
