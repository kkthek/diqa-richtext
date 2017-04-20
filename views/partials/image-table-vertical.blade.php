<br/>
<table class="DIQA-RICHTEXT-{{$category}}">
	@foreach($imageFiles as $imageFile)
	<tr>
		<td>
		@include('partials.image-table-content', array('im' => $imageFile))
		</td>
	</tr>
	@endforeach
</table>
<br/>