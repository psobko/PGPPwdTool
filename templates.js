
    <div class="btn-toolbar">
      <button class="btn btn-primary" data-bind="click: addPassword">New Password</button>
      <button class="btn" data-bind="click: $parent.removePassword">Import</button>
      <button class="btn">Export</button>
    </div>
    <table class="table table-hover span6">
      <thead>
        <tr>
          <th>location</th>
          <th>username</th>
          <th>password</th>
          <th>date</th>
        </tr>
      </thead>
      <tbody data-bind="foreach: passwords">
        <tr data-bind="">
        <td>
        <input type="text" placeholder="location" 
         data-bind="value: location, 
              editInPlace:location
              ">
        </td>
        <td>
        <input type="text" placeholder="username"
         data-bind="value: username, 
              editInPlace:username
              ">
        </td>
        <td>
        <input type="text" placeholder="password"
         data-bind="value: password, 
              editInPlace:password
              ">
        </td>
        <td>
        <input type="text" placeholder="date"
         data-bind="value: date, 
              editInPlace:date
              ">
        </td>
        <td data-bind="click:$parent.removePassword"><i class="icon-trash"></i></td>
        </tr>     
      </tbody>
    </table>
    </div>
    <div>
      <textarea data-bind='value: lastSavedJson' rows='5' cols='60' disabled='disabled'> </textarea>
    </div>
