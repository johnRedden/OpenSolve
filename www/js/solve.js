

// Variables
var	knownFunctions=	[
	/*
		How this variable works:
			It takes whatever the 'name' is and replaces it with
		whatever is in the 'paste'. Uses the size to crop out
		any amount of text you need. That is needed for smooth
		user design. The 'nameID' is used to parse out any
		known function from finding the variables
	*/
	{ name: "sin", paste: "sin(", size: 3, nameID: "sin" },
	{ name: "cos", paste: "cos(", size: 3, nameID: "cos" },
	{ name: "tan", paste: "tan(", size: 3, nameID: "tan" },
	{ name: "csc", paste: "csc(", size: 3, nameID: "csc" },
	{ name: "sec", paste: "sec(", size: 3, nameID: "sec" },
	{ name: "cot", paste: "cot(", size: 3, nameID: "cot" },
	{ name: "sin(h", paste: "sinh(", size: 5, nameID: "sinh" },
	{ name: "cos(h", paste: "cosh(", size: 5, nameID: "cosh" },
	{ name: "tan(h", paste: "tanh(", size: 5, nameID: "tanh" },
	{ name: "csc(h", paste: "csch(", size: 5, nameID: "csch" },
	{ name: "sec(h", paste: "sech(", size: 5, nameID: "sech" },
	{ name: "cot(h", paste: "coth(", size: 5, nameID: "coth" },
	{ name: "ln", paste: "ln(", size: 2, nameID: "log" },
	{ name: "log", paste: "log(", size: 3, nameID: "log" }
];

// ###
// @input- jQuery object of the input textbox
// @index- the number index for the knownFunctions variable
// Returns a boolean, seeing if the input contains any known functions
// ###
// Finds if the given input object has a known function, given the index of the known function
function hasKnownFunction(input, index)
{
	if(input.val().substr(input[0].selectionStart-knownFunctions[index].name.length, knownFunctions[index].name.length)== knownFunctions[index].name)
		return true;
}

// ###
// Returns all the known functions in regex form, i.e. ( "sin|cos|tan" )
// ###
// Gets all the known functions ready for a regexpression
function getKnownFuncsForRegExp()
{
	// Variables
	var	regexStr=	"";
	
	for(var i= 0; i< knownFunctions.length; i++)
		regexStr+=	knownFunctions[i].nameID+((i== knownFunctions.length-1) ? "" : "|");
	
	return regexStr;
}

// ###
// @input- A string, preferably solved by Algebrite
// ###
// Finds all the variables of the
function findVariables(input)
{
	// Variables
	var	vars=	input.match(/([a-zA-Z])/g);
	var	temp=	"";
	
	if(vars== null)
		return;
	
	for(var i= 0; i< vars.length; i++)
	{
		vars[i]=	vars[i].replace(/[\s\(\)]/g, "");
		temp+=	vars[i];
	}
	temp=	temp.replace(new RegExp("("+getKnownFuncsForRegExp()+")", "g"), "");
	
	vars=	splitStringNoDuplicates(temp);
	temp=	$(".found-vars ul");
	temp.html("");
	for(var i= 0; i< vars.length; i++)
		temp.append("<li>"+vars[i]+"</li>");
}

// ###
// @str- A string
// Returns an array of strings with no duplicates
// ###
// Strips down the string to return an array of characters without any duplicates
function splitStringNoDuplicates(str)
{
	// Variables
	var	vars=	[];
	var	i=	0;
	
	for(var h= 0; h< str.length; h++)
	{
		if(vars.indexOf(str[h])== -1)
			vars[i++]=	str[h];
	}
	
	return vars;
}

// End of File