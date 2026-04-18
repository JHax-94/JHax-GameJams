class_name ApproachMessage extends Message

var runway: Runway
var approach: Approach

func _init(_runway: Runway, _approach: Approach) -> void:
	self.description = "Begin Approach"
	self.type = Message.Type.BEGIN_APPROACH
	self.runway = _runway
	self.approach = _approach
