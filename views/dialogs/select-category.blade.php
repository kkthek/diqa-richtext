<!-- Modal -->
<div id="{{$id}}" class="modal fade wiki-pages" role="dialog">
  <div class="modal-dialog-categorypicker">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Kategorien</h4>
      </div>
      <div class="modal-body">
       Suche: <input id="category-picker-search" type="text" style="width: 100%" />
       <div id="category-tree"></div>
       <input type="hidden" name="diqa_categorytree_selectednode" />
      <div class="modal-footer">
        <button type="button" action="add-link" class="btn btn-default">Füge Kategorie hinzu</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Abbrechen</button>
      </div>
    </div>

  </div>
</div>