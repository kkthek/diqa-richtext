<tr signature="{{$row->getName()}}" class="{{$even ? 'even' : 'odd' }} image-row">
    <td>{{$row->getName()}}</td>
    <td>{{$row->getExtension()}}</td>
    <td>{{$row->getWidth()}}x{{$row->getHeight()}}</td>
    <td>{{date("d.m.Y", strtotime($row->getTimestamp()))}}</td>
</tr>