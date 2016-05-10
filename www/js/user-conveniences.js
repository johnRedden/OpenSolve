

$(window).load(function(args)	{
	if(location.search)
	{
		// Variables
		var	str=	decodeURI(location.search.substring(1));
		
		$(".math-field").val(str).keyup();
	}
});

// Auto opens the parenthesis for the user
function easeParensOpen(input, val, index)
{
	// Variables
	var	ns=	input[0].selectionStart+(knownFunctions[index].paste.length-knownFunctions[index].name.length);
	
	input.val(val.substr(0, input[0].selectionStart-knownFunctions[index].size)+knownFunctions[index].paste+val.substr(input[0].selectionStart));
	input[0].selectionStart=	ns;
	input[0].selectionEnd=	input[0].selectionStart;
}

// End of File