class_name Glider extends Aircraft


func change_speed(change_by: float, delta: float):
	if change_by > 0:
		change_by = 0
	super.change_speed(change_by, delta)
	
func change_altitude(change_by: float):
	if change_by > 0:
		change_by = 0
	
	super.change_altitude(change_by)
	
func _ready() -> void:
	super._ready()
	
	self.fuel = 0;
	self.gravity = 4.6

func process_crash_land():
	if self.in_state(self.LANDED_OR_LANDING_STATES) == false:
		self.resolve_aircraft(Resolution.CRASHED, "CRASH_LANDED")

func process_no_fuel_movement(delta: float):
	self.move_at_speed(self.speed, delta)
	self.descent_speed = self.gravity / self.speed
	
	if self.state != State.LANDING:
		self.process_speed_change(delta)
		self.change_altitude(-self.descent_speed * delta)
		self.process_controlled_altitude_change(delta)
	else:
		self.process_controlled_altitude_change(delta)
