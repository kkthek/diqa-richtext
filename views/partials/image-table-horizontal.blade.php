<br/>
<table class="Wiki-{{$category}}">
<?php $i=0; ?>
	@foreach($imageFiles as $image)
	<tr>
		<td>
		 @include('partials.image-table-content', array('im' => $image))
		</td>
		@if($i+1 < count($imageFiles))
			<td>
			@include('partials.image-table-content', array('im' => $image))
			</td>
		@else
			<td></td>
		@endif
	</tr>
	<?php $i++; ?>
	@endforeach
	
</table>
<br/>