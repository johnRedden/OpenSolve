// send linear left hand side and right hand side... catches all scenarios
// I think we need to send this the variable too eqVar (one variable only)
function mathSolveGeneralLinear(lhs, rhs, eqVar){
    var outHTML = 'Solving Linear Equations <br/>';
    outHTML += lhs +' = '+rhs+'<br/><br/>';

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

        newlhs = Algebrite.run(origlhs+'/('+leadCoeff+')');
        newrhs = Algebrite.run(origrhs+'/('+leadCoeff+')');
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
    var outHTML = 'Solving Quadratic Equations <br/>';
    outHTML += lhs +' = '+rhs+'<br/><br/>';

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
        outHTML += newlhs +' = '+newrhs+'<br/>';
        origlhs=newlhs;
        origrhs=newrhs;
    }
    //at this point check if still quadratic?
    //check if factorable

    //outHTML += 'Factor.<br/>';
    newlhs = Algebrite.run('factor('+origlhs+')');
    if(origlhs!=newlhs){
        outHTML += newlhs +' = '+newrhs+'<br/>';
        origlhs=newlhs;
        origrhs=newrhs;
        //tag factorable
    }else{
        //break off to quadratic formula function
        //a whole stand-alone function will allow for two methods
    }
    //Oh goodness we need to get the linears in each parens
    //and call linear method above.
    
    
    return outHTML;
    
}
function mathSolveGeneralQuadraticFormula(lhs,rhs,eqVar){
    //quad formula work here
}