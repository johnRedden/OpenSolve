

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

function calculateAccurately(inputStr)
{
	// Variables
	var	pmArr=	splitIntoPlusMinus(Algebrite.run(inputStr));
	var	total=	0;
	var	left=	"";
	var	right=	"";
	var	type=	"";
	
	try	{
		for(var i= 0; i< pmArr.length; i++)
		{
			if(left== "")
			{
				left=	splitMultAndSolve(pmArr[i]);
			}
			else if(type== "")
			{
				type=	pmArr[i];
				if(type== "add")
					type=	" + ";
				else
					type=	" - ";
			}
			else
			{
				right=	splitMultAndSolve(pmArr[i]);
				total=	Algebrite(total+"+"+left+type+right);
				left=	"";
				type=	"";
				right=	"";
			}
		}
		if(left!= "")
			total=	Algebrite.run(total+"+"+left);
	}catch(e)	{	console.log(e);	}
	
	return {
		rawInput:	inputStr,
		command: "eval( "+inputStr+" )",
		result:	"= "+Algebrite.run(total)
	};
}

function replaceKnownFuncsForMult(str)
{
	// Variables
	var	nstr=	str.replace(/sin/g, " sin")
		.replace(/cos/g, " cos")
		.replace(/tan/g, " tan")
		.replace(/csc/g, " csc")
		.replace(/sec/g, " sec")
		.replace(/cot/g, " cot")
		.replace(/ln/g, " ln")
		.replace(/log/g, " log")
		.replace(/sinh/g, " sinh")
		.replace(/cosh/g, " cosh")
		.replace(/tanh/g, " tanh")
		.replace(/csch/g, " csch")
		.replace(/sech/g, " sech")
		.replace(/coth/g, " coth");
	
	return	{
		str:	nstr,
		changed:	(str.trim()!= nstr.trim())
	};
}

function splitMultAndSolve(miniEQ, bObj)
{
	// Variables
	var	splits=	miniEQ.split(" ");
	var	coef=	1;
	var	temp=	"";
	var	anyOtherVars=	"";
	
	try	{
		for(var i= 0; i< splits.length; i++)
		{
			temp=	replaceKnownFuncsForMult(splits[i]);
			if(temp.changed)
			{
				temp=	splitMultAndSolve(temp.str, true);
				coef*=	temp.coef;
				anyOtherVars+=	" "+temp.vars;
				continue;
			}
			
			if(!isNaN(splits[i]))
				coef*=	splits[i];
			else
			{
				try	{
					temp=	eval("with(Math) "+splits[i]);
					if(!isNaN(temp)) // If its a number
						coef*=	temp;
					else
					{
						if(anyOtherVars== "")
							anyOtherVars=	temp;
						else
							anyOtherVars+=	" "+temp;
					}
				} catch(e)	{	anyOtherVars+=	splits[i];	}
			}
		}
	} catch(e) { console.log(e);	}
	
	if(bObj)
	{
		return	{
			coef:	coef,
			vars:	anyOtherVars
		};
	}
	if(anyOtherVars== "")
		return coef;
	else
		return coef+" "+anyOtherVars;
}

function splitIntoPlusMinus(inputStr)
{
	// Variables
	var	algArr=	[];
	var	d=	0;
	var	plusi=	0;
	var	minusi=	0;
	var	closest=	0;
	
	// Extracts the eq into plus-minus arrays 
	while(true)
	{
		plusi=	inputStr.indexOf(" + ", closest);
		minusi=	inputStr.indexOf(" - ", closest);
		
		if(plusi== -1 && minusi== -1)
			break;
		else if((minusi> plusi && plusi!= -1) || (plusi!= -1 && minusi== -1))
		{
			algArr[d++]=	inputStr.substring(0, plusi);
			algArr[d++]=	"add";
			inputStr=	inputStr.substring(plusi);
			closest=	plusi;
		}
		else if((plusi> minusi && minusi!= -1) || (minusi!= -1 && plusi== -1))
		{
			algArr[d++]=	inputStr.substring(0, minusi);
			algArr[d++]=	"minus";
			inputStr=	inputStr.substring(minusi);
			closest=	minusi;
		}
	}
	algArr[d]=	inputStr;
	
	return algArr;
}

// End of File