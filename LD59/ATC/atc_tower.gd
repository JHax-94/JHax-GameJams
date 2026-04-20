class_name AtcTower extends  Node2D

signal receiver_added(body: Node2D)
signal receiver_removed(body: Node2D)
signal atc_ready(atcTower: AtcTower)

@onready var runway: Runway = $"../Runway"
@onready var signal_sprite: AnimatedSprite2D = $Signal_sprite

@export var runways: Array[Runway]

var comms_receivers: Array[SignalReceiver] = []

var rotate_speed: float = 2.0

@onready var comms_cone: Node2D = $comms_cone

@onready var signal_builder: SignalBuilder = $signal_builder

func _ready() -> void:
	self.signal_builder.atc_tower = self as AtcTower
	self.atc_ready.emit(self as AtcTower)
	self.signal_sprite.visible = false

func send_message():
	var message = self.signal_builder.get_message()
	
	if message != null:
		self.signal_sprite.visible = true
		self.signal_sprite.play()
		for receiver in comms_receivers:
			receiver.message(message)
		self.signal_builder.clear_signal()

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
		receiver.in_range()
		receiver_added.emit(body)

func _on_comms_cone_area_body_exited(body: Node2D) -> void:
	print("comms cone exited by body...")
	var receiver = body.get_parent() as SignalReceiver
	var body_index = -1
	
	if receiver != null:
		body_index = comms_receivers.find(receiver)
	
	if body_index >= 0:
		comms_receivers.remove_at(body_index)
		receiver.out_of_range()
		receiver_removed.emit(body)

func _on_signal_sprite_animation_looped() -> void:
	print("looped!")
	self.signal_sprite.stop()
	self.signal_sprite.visible = false
	
