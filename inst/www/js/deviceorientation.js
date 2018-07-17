class devicemotion {
	constructor(dataset)
	{
		this.dataset=dataset
		window.addEventListener('deviceorientation', (...args) => this.devicemotionListener(...args))
	}

	devicemotionListener(event) {
		(this.dataset.orientation = this.dataset.orientation || []).push(event.orientation);
	}
	
	features()
	{
	  f={}
	  o=this.dataset.orientation
	  d3=o.map(x=>sqrt((x.alpha-math.mean(o.alpha))**2+(x.beta-math.mean(o.beta))**2+(x.gamma-math.mean(o.gamma))**2))
	  
	  f["mean"]=math.mean[d3];
	  f["max"]=math.max[d3];
	  f["sd"]=math.std[d3];
	  
	  return f;
	}
	
	flush()
	{
	  this.dataset.orientation = [] ;
	}
	
}