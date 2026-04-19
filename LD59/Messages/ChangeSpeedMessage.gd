class_name ChangeSpeedMessage extends Message

var direction : Message.Direction

func _init(_direction: String) -> void:
	self.description = "Change Speed"
	self.type = Message.Type.CHANGE_SPEED
	self.direction = self.parse_direction(_direction)
