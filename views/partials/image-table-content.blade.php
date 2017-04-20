<div class="placeholder" id="<?php echo "img_".rand(); ?>">
  <img class="{{$im->getWidth() < $im->getHeight() ? 'BildHochformat_'.$category : 'BildQuerformat'}}" src="{{$im->getUrl()}}"/>
  <div style="text-align: center;">{{$im->getName()}}, {{date("d.m.Y", strtotime($im->getTimestamp()))}}</div>
</div>
