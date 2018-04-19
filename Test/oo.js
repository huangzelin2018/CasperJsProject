var reTag = /<img(?:.|\s)*?>/g;
var str = '<div><img id="img1" src="images/picture1.png" onclick="change()">234</div>'
console.log(str.replace(reTag,''));