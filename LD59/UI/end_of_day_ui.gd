class_name EndOfDayUi extends PanelContainer

var grades : Array[String] = [ "S", "A", "B", "C", "D", "F" ]
@export var airfield_root: Node2D
@export var grade_thresholds : Array[int]
@onready var planes_landed_value: Label = $VBoxContainer/PlanesLanded/Value
@onready var planes_crashed_value: Label = $VBoxContainer/PlanesCrashed/Value
@onready var grade_value_value: Label = $VBoxContainer/Grade/Value

var roster : Array[Aircraft] = []

var crashed_count:int = 0;
var landed_count:int = 0;

func calculate_grade() -> String:
	var grade = self.grades[self.grades.size()-1]
	for index in range(0, self.grade_thresholds.size()):
		if self.landed_count >= self.grade_thresholds[index]:
			grade = self.grades[index]
			break
	return grade

func refresh_ui():
	
	self.planes_crashed_value.text = str(crashed_count)
	self.planes_landed_value.text = str(landed_count)
	self.grade_value_value.text = self.calculate_grade()
	
	if crashed_count + landed_count >= roster.size():
		self.visible = true


func aircraft_resolved(resolution: Aircraft.Resolution):
	match resolution:
		Aircraft.Resolution.CRASHED:
			crashed_count += 1
		Aircraft.Resolution.LANDED:
			landed_count += 1
	
	self.refresh_ui()

func populate_roster() -> void:
	var nodes = airfield_root.get_children()
	for node in nodes:
		print("Checking node for aircraft: " + node.name)
		var aircraft = node as Aircraft
		if aircraft != null:
			aircraft.aircraft_resolved.connect(aircraft_resolved)
			self.roster.append(aircraft)
		
			
	print("Populated roster with " + str(self.roster.size()) + " aircraft")

func _ready() -> void:
	self.populate_roster()
