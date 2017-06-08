<!-- Modal -->
<div id="{{$id}}" class="modal fade richtext-dialog" role="dialog">
  <div class="modal-dialog-richtext">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">{{wfMessage('diqa-richtext-images')->text()}}</h4>
      </div>
      <div class="modal-body">
       <div>Suche: <input type="text" class="richtext-search-field"/><input type="button" value="Suchen" id="richtext-image-search" /></div>
       <div class="richtext-preview-image"></div>
       <div class="richtext-image-list">
      	@include('dialogs.select-image-list', array('rows' => $rows))
       </div>
      </div>
      <div>
      <div><input class="add-to-basket" type="button" value="Übernehmen > " /></div>
      <div><input class="richtext-image-result" type="text" value="{{$signature}}" />
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" action="add-image" class="btn btn-default">{{wfMessage('diqa-richtext-add-image')->text()}}</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">{{wfMessage('diqa-richtext-cancel')->text()}}</button>
      </div>
    </div>

  </div>
</div>