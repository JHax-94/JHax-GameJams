class_name ApproachMessage extends Message

var runway: Runway

func _init(_runway: Runway) -> void:
	self.description = "Begin Approach"
	self.type = Message.Type.BEGIN_APPROACH
	self.runway = _runway
