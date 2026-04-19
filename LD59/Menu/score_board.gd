class_name ScoreBoard extends Node

var grade_list : Array[String] = [ "S", "A", "B", "C", "D", "F"]

var level_scores : Dictionary = {}

func record_score(score_key: String, grade: String):	
	if level_scores.has(score_key) == false:
		level_scores[score_key] = []
	
	level_scores[score_key].push(grade)
	
func score_index(grade: String) -> int:
	var index = grade_list.find(grade)
	if index < 0:
		index = grade_list.size() + 1
		
	return index

func best_score_for_key(score_key: String) -> String:
	var return_score:String = ""
	
	if level_scores.has(score_key):
		var scores_list = level_scores[score_key]
		if scores_list.size() > 0:
			var best_grade = scores_list[0]
			
			for i in range(1, level_scores.size()):
				var score = scores_list[i]
				
				if self.score_index(score) < self.score_index(best_grade):
					best_grade = score
					
			return_score = best_grade
			
	return return_score
	
