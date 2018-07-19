class devicemotion {
	constructor(dataset)
	{
		this.dataset=dataset
		window.addEventListener('deviceorientation', (...args) => this.devicemotionListener(...args))
	}

	devicemotionListener(event) {
		(this.dataset.orientation = this.dataset.orientation || []).push(event);
	}
	
	features()
	{
	  var f={}
	  if((this.dataset.orientation = this.dataset.orientation || []).length>0)
	 {
	  var o=this.dataset.orientation
	  var alpha=o.map(x=>x.alpha)
	  var beta=o.map(x=>x.beta)
	  var gamma=o.map(x=>x.gamma)
	  var d3=o.map(x=>Math.sqrt((x.alpha-math.mean(alpha))**2+(x.beta-math.mean(beta))**2+(x.gamma-math.mean(gamma))**2))
	  
	  f["mean"]=math.mean(d3);
	  f["max"]=math.max(d3);
	  f["sd"]=math.std(d3);
	 }
	  
	  return f;
	}
	
	flush()
	{
	  this.dataset.orientation = [] ;
	}
	
}
