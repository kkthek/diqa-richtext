<!-- Modal -->
<div id="{{$id}}" class="modal fade wiki-pages" role="dialog">
  <div class="modal-dialog-wikipages">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">{{wfMessage('diqa-richtext-link-dialog')->text()}}</h4>
      </div>
      <div class="modal-body">
      	<div id="tabs">
		  <ul>
		    <li><a href="#tabs-1">{{wfMessage('diqa-richtext-wikipages')->text()}}</a></li>
		    <li><a href="#tabs-2">{{wfMessage('diqa-richtext-external-urls')->text()}}</a></li>
		
		  </ul>
		  <div id="tabs-1">
		     <div>{{wfMessage('diqa-richtext-wikipage')->text()}}: <input type="text" id="wiki-pages-search-field" class="wiki-pages-input-field"/></div>
		     <input type="hidden" id="wiki-pages-fulltitle-field"/>
		  </div>
		  <div id="tabs-2">
		     <div>{{wfMessage('diqa-richtext-url')->text()}}: <input type="text" id="wiki-pages-url-field" class="wiki-pages-input-field"/></div>
		     <div>{{wfMessage('diqa-richtext-label')->text()}}: <input type="text" id="wiki-pages-label-field" class="wiki-pages-input-field"/></div>
		  </div>
		  
		</div>
      
      
      <div class="modal-footer">
        <button type="button" action="add-link" class="btn btn-default">{{wfMessage('diqa-richtext-add-link')->text()}}</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">{{wfMessage('diqa-richtext-cancel')->text()}}</button>
      </div>
    </div>

  </div>
</div>