extends CheckButton

func _ready() -> void:
	self.button_pressed = SETTINGS.TUTORIAL_ON

func _on_toggled(toggled_on: bool) -> void:
	SETTINGS.TUTORIAL_ON = toggled_on
