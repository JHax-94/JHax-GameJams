extends Control

func _process(delta: float) -> void:
	print("Menu here!")
	if Input.is_action_just_pressed("menu"):
		self.visible = !self.visible
	


func _on_main_menu_pressed() -> void:
	get_tree().change_scene_to_file("res://Menu/MainMenu.tscn")


func _on_continue_playing_pressed() -> void:
	self.visible = false
