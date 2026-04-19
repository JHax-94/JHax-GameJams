class_name AbortMessage extends Message

func _init() -> void:
	self.description = "Abort"
	self.type = Type.ABORT
