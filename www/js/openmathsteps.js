// send linear left hand side and right hand side... catches all scenarios
// I think we need to send this the variable too eqVar (one variable only)
function mathSolveGeneralLinear(lhs, rhs, eqVar){
    var outHTML = ''; // 'Solving Linear Equations <br/>'
    //outHTML += lhs +' = '+rhs+'<br/><br/>';

    //Quote the original ascii input (quote is not what I expected?)
    var origlhs = Algebrite.run('quote('+lhs+')');
    var origrhs = Algebrite.run('quote('+rhs+')');
    outHTML += origlhs +' = '+origrhs+'<br/>';

    //outHTML += 'Add same-side like terms.<br/>';
    var newlhs = Algebrite.run(lhs);
    var newrhs = Algebrite.run(rhs);
    if(origlhs!=newlhs || origrhs!=newrhs){
        outHTML += newlhs +' = '+newrhs+'<br/>';
        origlhs=newlhs;
        origrhs=newrhs;
    }

    var likeTerm = Algebrite.run('-1*(coeff('+origrhs+',x,1))'); //coeff of deg 1 term
    //outHTML += 'Combine opposite-side like terms. Add '+likeTerm+'x to both sides<br/>';
    newlhs = Algebrite.run(origlhs+'+('+likeTerm+'x)');
    newrhs = Algebrite.run(origrhs+'+('+likeTerm+'x)');
    if(origlhs!=newlhs || origrhs!=newrhs){
        outHTML += newlhs +' = '+newrhs+'<br/>';
        origlhs=newlhs;
        origrhs=newrhs;
    }

    var deglhs = Algebrite.run('deg('+newlhs+')');

    if(deglhs!='0'){
        var constTerm = Algebrite.run('-1*(coeff('+origlhs+',x,0))');
        //outHTML += 'Add '+constTerm+' to both sides<br/>';
        newlhs = Algebrite.run(origlhs+'+('+constTerm+')');
        newrhs = Algebrite.run(origrhs+'+('+constTerm+')');
        if(origlhs!=newlhs || origrhs!=newrhs){
            outHTML += newlhs +' = '+newrhs+'<br/>';
            origlhs=newlhs;
            origrhs=newrhs;
        }

        var leadCoeff = Algebrite.run('coeff('+origlhs+',x,1)');
        //outHTML += 'Divide both sides by '+leadCoeff+'.<br/>';               

        newlhs = Algebrite.run('('+origlhs+')'+'/('+leadCoeff+')');
        newrhs = Algebrite.run('('+origrhs+')'+'/('+leadCoeff+')');
        if(origlhs!=newlhs || origrhs!=newrhs){
            outHTML += newlhs +' = '+newrhs+'<br/>';
            origlhs=newlhs;
            origrhs=newrhs;
        }              

    }else{
        if(origlhs!=origrhs)
            outHTML += 'No solution.<br/>';
        else
            outHTML += 'All real numbers are solutions.<br/>';
    }

    return outHTML;
}

// solve quadratic equations (one variable only)
function mathSolveGeneralQuadratic(lhs,rhs,eqVar){
    var outHTML = ''; // 'Solving Quadratic Equations <br/>
    //outHTML += lhs +' = '+rhs+'<br/><br/>';

    //Quote the original ascii input (quote is not what I expected?)
    var origlhs = Algebrite.run('quote('+lhs+')');
    var origrhs = Algebrite.run('quote('+rhs+')');
    outHTML += origlhs +' = '+origrhs+'<br/>';

    //outHTML += 'Simplify both sides.<br/>';
    var newlhs = Algebrite.run(lhs);
    var newrhs = Algebrite.run(rhs);
    if(origlhs!=newlhs || origrhs!=newrhs){
        outHTML += newlhs +' = '+newrhs+'<br/>';
        origlhs=newlhs;
        origrhs=newrhs;
    }

    //outHTML += 'Combine opposite-side like terms and set to zero.<br/>';
    newlhs = Algebrite.run(origlhs+'-('+origrhs+')');
    newrhs = Algebrite.run(origrhs+'-('+origrhs+')');
    if(origlhs!=newlhs || origrhs!=newrhs){
        
        //at this point check if still quadratic? rhs should be zero.
        var checkDeg = Algebrite.run('deg('+newlhs+',x)');
        if(checkDeg<2) {
            outHTML+=mathSolveGeneralLinear(newlhs,'0','x');
            return outHTML;
        }
        
        outHTML += newlhs +' = '+newrhs+'<br/>';
        origlhs=newlhs;
        origrhs=newrhs;
    }

    //check if factorable
    //outHTML += 'Factor.<br/>';
    newlhs = Algebrite.run('factor('+origlhs+')');
    if(origlhs!=newlhs){
         //tag factorable
        outHTML += newlhs +' = '+newrhs+'<br/>';
        origlhs=newlhs;
        origrhs=newrhs;
       
        //to get the linears inside the parens... Paul can do better here.
        var matches = origlhs.match(/\(([^()]+)\)/g);  
        if(matches.length===2){
            var linear1 = matches[0].substr(1,matches[0].length-2); //this is nonsense!
            var linear2 = matches[1].substr(1,matches[1].length-2);
        }else{
            var tempindex = origlhs.search(/\(/);
            var linear1 = origlhs.substr(0,tempindex);
            var linear2 = matches[0].substr(1,matches[0].length-2);
            if(linear1==='') linear1=linear2;
        }

        var temp1HTML = mathSolveGeneralLinear(linear1,'0','x');
        var temp2HTML = mathSolveGeneralLinear(linear2,'0','x');
        outHTML += '<table align="center"><tr><td style="padding:10px" valign="top">'+temp1HTML+'</td><td style="padding:10px" valign="top">'+temp2HTML+'</td></tr></table>'       
        
    }else{
        //a whole stand-alone function will allow for two methods
        outHTML+="Not factorable over the integers.<br/>";
        //break off to quadratic formula function
        outHTML+=mathSolveGeneralQuadraticFormula(origlhs,'0','x');
        // or extracting roots
    }
    
    return outHTML;
}
function mathSolveGeneralQuadraticFormula(lhs,rhs,eqVar){
    var outHTML = '';
    //asuming standard form
    var a = Algebrite.run('coeff('+lhs+','+eqVar+',2)');
    var b = Algebrite.run('coeff('+lhs+','+eqVar+',1)');
    var c = Algebrite.run('coeff('+lhs+','+eqVar+',0)');
    
    outHTML += 'a = '+a+', b = '+b+', c = '+c+'<br/>';
    outHTML += eqVar+' = ( -b ± sqrt(b^2-4ac) ) / (2a)<br/>';
    outHTML += eqVar+' = ( -('+b+') ± sqrt(('+b+')^2-4('+a+')('+c+')) ) / (2('+a+'))<br/>';
    var descrim = Algebrite.run('('+b+')^2-4('+a+')('+c+')');
    var denom = Algebrite.run('(2('+a+'))');
    var oppb = Algebrite.run('-1*('+b+')');
    outHTML += eqVar+' = ( '+oppb+' ± sqrt('+descrim+') ) / '+denom+'<br/>';
    //now need to reduce somehow.
    
    
    return outHTML;
}

function startsStepsForDerivative(inputStr)
{
	// Variables
	var	outHTML=	inputStr+"<br/>";
	var	pmArr=	splitIntoPlusMinus(Algebrite.run(inputStr));
	var	a=	"";
	
	for(var i= 0; i< pmArr.length; i++)
	{
		a=	doStepForDerivative(
			splitMultAndSolve(pmArr[i], true),
			a,
			findOutDerivativeRule(splitMultAndSolve(pmArr[i], true))
		);
		i++;
		if(i>= pmArr.length)
			break;
		if(pmArr[i]== "add")
			a+=	" + ";
		else
			a+=	" - ";
		i++;
		a=	doStepForDerivative(
			splitMultAndSolve(pmArr[i], true),
			a,
			findOutDerivativeRule(splitMultAndSolve(pmArr[i], true))
		);
	}
	outHTML+=	a+"<br/>";
	a=	a.replace(/d\/dx/g, "d");
	a=	Algebrite.run(a);
	outHTML+=	a;
	
	return outHTML;
}

function doStepForDerivative(eqObj, outHTML, rule)
{
	// Variables
	var	fx;
	var	gx;
	
	switch(rule)
	{
		case "quot_chainrule": // Grab first and slap it with the second one, then figure it out with a third?
			fx=	eqObj.vars.split(" ");
			gx=	fx[1];
			fx=	fx[0];
			
			return outHTML+eqObj.coef;//*(
				//
			//);
		case "mult_chainrule": // Second verse same as the first
			fx=	eqObj.vars.split(" ");
			gx=	fx[1];
			fx=	fx[0];
			
			return outHTML+eqObj.coef+"*("+(
				fx+" ("+Algebrite.run("d("+gx+")")+") + "+
				"("+Algebrite.run("d("+fx+")")+") "+gx
			)+")";
			/*return outHTML+Algebrite.run(
				eqObj.coef+"*("+
					fx+"*d("+gx+")+d("+fx+")*"+gx
			);*/
		case "d": // Just straight up hiddly hoodly
			return outHTML+(eqObj.coef+"*("+Algebrite.run("d("+eqObj.vars+")")+")");
	}
	
	return outHTML;
}

function findOutDerivativeRule(eqObj)
{
	console.log(eqObj);
	if(eqObj.vars.indexOf(" / ")!= -1)
		return "quot_chainrule";
	if(eqObj.vars.indexOf(" ")!= -1)
		return "mult_chainrule";
	return "d";
}