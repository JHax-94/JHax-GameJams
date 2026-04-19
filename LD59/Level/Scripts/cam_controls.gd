extends Camera2D

var move_speed = 60;

func _process(delta: float) -> void:
	var move_vec = Vector2(0, 0)
	
	if Input.is_action_pressed("cam_down"):
		move_vec.y = 1
	elif Input.is_action_pressed("cam_up"):
		move_vec.y = -1
	
	if Input.is_action_pressed("cam_left"):
		move_vec.x = -1
	elif Input.is_action_pressed("cam_right"):
		move_vec.x = 1
	
	self.translate(delta * move_vec * move_speed)
		
