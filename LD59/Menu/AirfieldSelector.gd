class_name AirfieldSelector extends VBoxContainer

@export var airfield_scenes : Array[Resource]

@export var airfield_name : String
@export var airfield_key : String
@onready var title: Label = $Title

func load_scene(scene: Resource) -> void:
	get_tree().change_scene_to_file(scene.resource_path)

func _ready() -> void:
	title.text = self.airfield_name
	var day = 1
	for scene in airfield_scenes:
		var day_label = Label.new()
		
		day_label.text = "Day " + str(day)
		self.add_child(HSeparator.new())
		#self.add_child(day_label)
		#self.add_child(HSeparator.new())
		
		var grade_label = Label.new()
		
		var key = SCORE_BOARD.get_score_key(self.airfield_key, str(day))
		var best_score = SCORE_BOARD.best_score_for_key(key)
		
		if best_score.length() == 0:
			best_score = "-"
		
		grade_label.text = "Best Grade: " + best_score
		
		self.add_child(grade_label)
		var button = Button.new()
		button.pressed.connect(func(): load_scene(scene))
		button.text = "Play Airfield"
		day += 1
		self.add_child(button)
		
		
