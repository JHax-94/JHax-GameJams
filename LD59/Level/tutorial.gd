class_name TutorialUi extends CanvasLayer

var tutorial_step = 0

@export_multiline var tutorial_steps : Array[String]
@onready var tutorial_text: Label = $TutBox/MarginContainer/VBoxContainer/TutorialText
@onready var tut_box: PanelContainer = $TutBox
@onready var dismiss_timer: Timer = $DismissTimer

func set_tutorial_step(step):
	if step < self.tutorial_steps.size():
		var tut_text = self.tutorial_steps[step]
		self.tutorial_text.text = tut_text
		self.tut_box.visible = true
		self.tutorial_step = step
	
func _ready() -> void:
	self.set_tutorial_step(0)

func _on_ok_button_pressed() -> void:
	self.tut_box.visible = false
	self.dismiss_timer.start()

func _on_dismiss_timer_timeout() -> void:
	self.set_tutorial_step(self.tutorial_step+1)
