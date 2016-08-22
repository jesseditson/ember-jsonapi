import { Factory<%if (hasFaker){%>, faker<%}%> } from 'ember-cli-mirage';

export default Factory.extend({
<% fields.forEach(function(f, idx) { %>  "<%=f.name%>": <%if (f.fakerPath) {%>function() { return faker.<%= f.fakerPath %>(); }<%} else {%>null<%}%><%if (idx < fields.length - 1) {%>,<%}%>
<% }) %>});
