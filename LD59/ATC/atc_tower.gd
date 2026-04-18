class_name AtcTower extends  Node2D

signal receiver_added(body: Node2D)
signal receiver_removed(body: Node2D)

var comms_receivers: Array = []

var rotate_speed: float = 2.0

@onready var comms_cone: Node2D = $comms_cone

func _process(delta: float) -> void:
	if Input.is_action_pressed("rotate_anticlockwise"):
		comms_cone.rotate(- delta * rotate_speed)
	elif Input.is_action_pressed("rotate_clockwise"):
		comms_cone.rotate(delta * rotate_speed)
	

func _on_comms_cone_area_body_entered(body: Node2D) -> void:
	print("comms cone entered by body!")
	comms_receivers.append(body)
	receiver_added.emit(body)

func _on_comms_cone_area_body_exited(body: Node2D) -> void:
	print("comms cone exited by body...")
	var body_index = comms_receivers.find(body)
	if body_index >= 0:
		comms_receivers.remove_at(body_index)
		receiver_removed.emit(body)
