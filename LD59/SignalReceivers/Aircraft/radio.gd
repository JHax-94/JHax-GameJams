class_name Radio extends Node2D

@onready var radio_player: AudioStreamPlayer2D = $RadioPlayer
@export var audio_files : Array[AudioStreamOggVorbis]
@onready var audio_delay: Timer = $AudioDelay

var last_index = 0

func message_received():
	self.audio_delay.start()

func play_voice():
	var roll = randi_range(1, audio_files.size() - 2)
	var index = (last_index + roll) % audio_files.size()
	self.radio_player.stream = audio_files[index]
	self.radio_player.play()
	self.last_index = index
	
func _on_audio_delay_timeout() -> void:
	self.play_voice()
