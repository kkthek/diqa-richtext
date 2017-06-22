<!-- Modal -->
<div id="{{$id}}" class="modal fade richtext-upload-dialog" role="dialog">
  <div class="modal-dialog-upload-richtext">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">{{wfMessage('diqa-richtext-upload-image')->text()}}</h4>
      </div>
      <div class="modal-body">
      <iframe style="width: 100%; height: 100%" src="{{$wgScriptPath}}/index.php/Special:Upload?usedInIframe=true"></iframe>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">{{wfMessage('diqa-richtext-close')->text()}}</button>
      </div>
    </div>

  </div>
</div>