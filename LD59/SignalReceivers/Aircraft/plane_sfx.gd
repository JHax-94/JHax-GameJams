class_name PlaneSfx extends Node2D

var dict : Dictionary ={}

func _ready() -> void:
	for node in self.get_children():
		var stream = node as AudioStreamPlayer2D
		if stream:
			self.dict[stream.name] = stream

func sfx(key) -> AudioStreamPlayer2D:
	var player : AudioStreamPlayer2D = null
	if self.dict.has(key):
		player = self.dict[key]
	
	return player
