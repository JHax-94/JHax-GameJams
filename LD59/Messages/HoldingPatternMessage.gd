class_name HoldingPatternMessage extends Message

var radius : Message.Radius

func _init(_radius: String) -> void:
	self.description = "Holding Pattern"
	self.type = Message.Type.HOLDING_PATTERN
	self.radius = self.parse_radius(_radius)
