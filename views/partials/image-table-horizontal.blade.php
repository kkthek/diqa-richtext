@foreach($imageFiles as $image)
	@include('partials.image-table-content', array('im' => $image))
	<br/>
@endforeach
