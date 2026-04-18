class_name SignalBuilder extends Node2D

@export var signal_inputs : Array[String]
var atc_tower : AtcTower

signal signal_type_changed(new_type: String, params: Array)

var signal_dictionary : Dictionary = {
	"circle_runway": [ "runway", "approach" ],
	"abort": [],
	"clear_for_landing": []
}

var current_signal : Dictionary = {
	"type": ""
}

func field_required(field_name: String) -> bool:
	var required = false
	
	var type = current_signal["type"]
	if type.length() > 0:
		var fields = signal_dictionary[type] as Array
		if fields.find(field_name) >= 0:
			required = true
			
	return required

func get_runway_options() -> Array[Runway]:
	return atc_tower.runways

func signal_changed():
	var params: Array = []
	var signal_type = current_signal["type"]
	
	if signal_type.length() > 0:
		var fields = signal_dictionary[signal_type]
		print("Signal changed [" + signal_type + "] Check fields:")
		print(str(fields))
		for field in fields:
			if field == "runway":
				var runway_array: Array = [ "runway" ]
				params.append(runway_array)
				
			if field == "approach":
				print("Build approach array...")
				var approaches_array: Array = [ "approach" ]
				if current_signal.has("runway"):
					var runway = current_signal["runway"] as Runway
					
					print("Runway has " + str(runway.approach_points.size()) + " approach points")
					
					for approach in runway.approach_points:
						var approach_str = approach.key_text + " - " + approach.title
						print("Add approach: " + approach_str)
						approaches_array.append(approach_str)
				
				if approaches_array.size() == 1:
					approaches_array.append("-")
					
				params.append(approaches_array)

		signal_type_changed.emit(signal_type, params, self.current_signal)

func set_signal(signal_type) -> void:
	current_signal["type"] = signal_type
	print("Signal type: " + signal_type)
	self.signal_changed()

func signal_valid() -> bool:
	var valid: bool = true
	
	if (current_signal["type"] as String).length() <= 0:
		valid = false
	else:
		var fields : Array = signal_dictionary[current_signal["type"]]
		for field in fields:
			if current_signal.has(field) == false or current_signal[field] == null:
				valid = false
				break
				
	return valid

func get_message() -> Message:
	var message: Message = null
	
	if self.signal_valid():
		match self.current_signal["type"]:
			"circle_runway":
				message = ApproachMessage.new(self.current_signal["runway"] as Runway, self.current_signal["approach"] as Approach)
			"clear_for_landing":
				message = ClearForLandingMessage.new()
			_:
				print("Not yet implemented!")
	else:
		print("Signal invalid!")
		
	return message

func _ready() -> void:
	self.signal_changed()

func _process(delta: float) -> void:
	for input in signal_inputs:
		if Input.is_action_just_pressed(input):
			self.set_signal(input)
			
	
	if field_required("runway"):
		for runway in atc_tower.runways:
			if Input.is_key_pressed(runway.input):
				if self.current_signal.has("runway") == false or self.current_signal["runway"] != runway:
					print("select runway " + runway.title)
					self.current_signal["runway"] = runway
					self.signal_changed()
					
	if field_required("approach") and self.current_signal.has("runway"):
		var runway = self.current_signal["runway"] as Runway
		for approach in runway.approach_points:
			if Input.is_key_pressed(approach.input):
				if self.current_signal.has("approach") == false or self.current_signal["approach"] != approach:
					self.current_signal["approach"] = approach
					self.signal_changed()
				
			
		
		
