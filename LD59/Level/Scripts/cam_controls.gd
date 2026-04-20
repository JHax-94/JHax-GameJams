class_name AtcCamera extends Camera2D

@export var min_camera_pos:Vector2 = Vector2(-300, -200)
@export var max_camera_pos:Vector2 = Vector2(300, 200)

var move_speed = 80;

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
	
	move_vec = move_vec * delta * move_speed
	
	if move_vec.x > 0 and self.global_position.x + move_vec.x > max_camera_pos.x:
		move_vec.x = max_camera_pos.x - global_position.x
	elif move_vec.x < 0 and self.global_position.x + move_vec.x < min_camera_pos.x:
		move_vec.x = min_camera_pos.x - global_position.x
	
	if move_vec.y > 0 and self.global_position.y + move_vec.y > max_camera_pos.y:
		move_vec.y = max_camera_pos.y - global_position.y
	elif move_vec.y < 0 and self.global_position.y + move_vec.y < min_camera_pos.y:
		move_vec.y = min_camera_pos.y - global_position.y
	
	self.translate(delta * move_vec * move_speed)
	
		
