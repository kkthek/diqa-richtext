<table id="richtext-image-list" class="sortable smwtable jquery-tablesorter">
<?php $i = 0; ?>
    <thead>
        <tr class="head">
            <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Dateiname</th>
            <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Typ</th>
            <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Auflösung</th>
            <th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Upload-Datum</th>
            
        </tr>
    </thead>
    <tbody>
    	@foreach($rows as $row)
    	   	@include('dialogs.select-image-row', array('row' => $row, 'even' => $i++ % 2 == 0))
    	@endforeach
    </tbody>
</table>


