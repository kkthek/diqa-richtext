@foreach($imageFiles as $imageFile)
	@include('partials.image-table-content', array('im' => $imageFile))
	<br/>
@endforeach
