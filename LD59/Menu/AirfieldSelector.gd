class_name AirfieldSelector extends VBoxContainer

@export var airfield_scenes : Array[Resource]

@export var airfield_name : String
@onready var title: Label = $Title

func load_scene(scene: Resource) -> void:
	get_tree().change_scene_to_file(scene.resource_path)

func _ready() -> void:
	title.text = self.airfield_name
	var day = 1
	for scene in airfield_scenes:
		var button = Button.new()
		button.pressed.connect(func(): load_scene(scene))
		button.text = "Play Day " + str(day)
		day += 1
		self.add_child(button)
		
		
