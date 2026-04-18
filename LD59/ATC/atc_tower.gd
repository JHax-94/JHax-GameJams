class_name AtcTower extends  Node2D

signal receiver_added(body: Node2D)
signal receiver_removed(body: Node2D)

@onready var runway: Runway = $"../Runway"

var comms_receivers: Array[SignalReceiver] = []

var rotate_speed: float = 2.0

@onready var comms_cone: Node2D = $comms_cone

func send_message():
	
	
	var message = ApproachMessage.new(runway)
	
	print(message)
	
	for receiver in comms_receivers:
		receiver.message(message)

func _process(delta: float) -> void:
	if Input.is_action_pressed("rotate_anticlockwise"):
		comms_cone.rotate(- delta * rotate_speed)
	elif Input.is_action_pressed("rotate_clockwise"):
		comms_cone.rotate(delta * rotate_speed)
		
	if Input.is_action_just_released("send_message"):
		send_message()
	

func _on_comms_cone_area_body_entered(body: Node2D) -> void:
	print("comms cone entered by body!")
	var receiver = body.get_parent() as SignalReceiver
	
	if receiver != null:
		comms_receivers.append(receiver)
		receiver_added.emit(body)

func _on_comms_cone_area_body_exited(body: Node2D) -> void:
	print("comms cone exited by body...")
	var receiver = body.get_parent() as SignalReceiver
	var body_index = -1
	
	if receiver != null:
		body_index = comms_receivers.find(receiver)
	
	if body_index >= 0:
		comms_receivers.remove_at(body_index)
		receiver_removed.emit(body)
