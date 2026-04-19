class_name ChangeAltitudeMessage extends Message

var direction : Message.Direction

func _init(_direction: String) -> void:
	self.description = "Change Altitude"
	self.type = Message.Type.CHANGE_ALTITUDE
	self.direction = self.parse_direction(_direction)
