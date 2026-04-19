extends Control

@export var atc : AtcTower

var receiver_readouts : Dictionary = {}
@onready var tracker_value: Label = $PanelContainer/ui_rows/Tracker_Count/TrackerValue
@onready var ui_rows: VBoxContainer = $PanelContainer/ui_rows

func receivers_changed():
	tracker_value.text = str(atc.comms_receivers.size())

func add_receiver_ui(body: Node2D):
	var new_label = Label.new()
	new_label.text = body.name
	receiver_readouts[body] = new_label
	ui_rows.add_child(new_label)
	receivers_changed()
	
func remove_receiver_ui(body: Node2D):
	var receiver_label = receiver_readouts[body] as Label
	ui_rows.remove_child(receiver_label)
	receiver_readouts.erase(body)
	receivers_changed()
	
func _ready():
	atc.receiver_added.connect(add_receiver_ui)
	atc.receiver_removed.connect(remove_receiver_ui)

func _on_button_pressed() -> void:
	get_tree().change_scene_to_file("res://Menu/MainMenu.tscn")
