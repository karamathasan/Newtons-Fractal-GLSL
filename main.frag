precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

/////// NUMBER SYSTEM AND OPERATIONS
struct Real{
    float value;
};

struct Imaginary{
    float value;
};

struct Complex{
    Real realValue;
    Imaginary imaginaryValue;
};

// Complex squareComplex(Complex complex){
//     float biSquared = complex.imaginaryValue.value * complex.imaginaryValue.value;
    
//     Real realComponent = Real(complex.realValue.value * complex.realValue.value - biSquared);
//     Imaginary imaginaryComponent = Imaginary(complex.imaginaryValue.value * complex.realValue.value * 2.);
//     // return Complex(Real(biSquared),imaginaryComponent);
//     return Complex(realComponent,imaginaryComponent);
// }

Complex addComplex(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value + b.realValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value + b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

Complex subtractComplex(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value - b.realValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value - b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

Complex multiplyComplex(Complex a, Complex b){
    Real real = Real(a.realValue.value * b.realValue.value - (a.imaginaryValue.value * b.imaginaryValue.value)); 
    Imaginary imaginary = Imaginary(a.imaginaryValue.value * b.realValue.value + a.realValue.value * b.imaginaryValue.value);
    return Complex(real,imaginary);
}

Complex powComplex(Complex c, int p){
    Real real;
    Imaginary imaginary;
    Complex result = Complex(Real(1.),Imaginary(1.));
    if (c.realValue.value > 0.){
        real = Real(1.);
    } else real = Real(0.);

    if (c.imaginaryValue.value > 0.){
        imaginary = Imaginary(1.);
    } else imaginary = Imaginary(0.);

    for(int i = 0; i<5; i++){
        if (i >= p){
            break;
        }
        result = multiplyComplex(result, c);
    } 
    return result;
}

Complex negate(Complex c){
    return Complex(Real(-1. * c.realValue.value), Imaginary(-1. * c.imaginaryValue.value));
}

Complex conjugate(Complex c){
    return Complex(c.realValue, Imaginary(c.imaginaryValue.value * -1.));
}

Complex divideComplex(Complex a, Complex b){
    Complex conjugate = conjugate(b);
    Complex numerator = multiplyComplex(a,conjugate);
    Complex denominator = multiplyComplex(b, conjugate);
    Complex result = Complex(
        Real(numerator.realValue.value / denominator.realValue.value),
        Imaginary(numerator.imaginaryValue.value / denominator.realValue.value)
    );
    return result;
}

float complexLength(Complex complex){
    vec2 vec =  vec2(abs(complex.realValue.value),abs(complex.imaginaryValue.value));
    return length(vec);
}

float complexDistance(Complex a, Complex b){
    Complex dist = subtractComplex(a,b);
    return complexLength(dist);
}

//////// ALGERBA
//a root is a representation of x-c, so when you multiply roots, 
// you return (x-c1)(x-c2) = x^2 + -(c1+c2) + c1c2
struct Root{
    Complex c;
};

struct Term{
    Complex c;
    int degree;
};

// maximum is quintic, uses constants in front of powers of x instead of the roots themselves
struct Polynomial{
    Term leading;
    Term x4;
    Term x3;
    Term x2;
    Term x;
    Term constant;
    int degree;
};

Complex emptyComplex(){
    return Complex(Real(0.),Imaginary(0.));
}

Term emptyTerm(int power){
    return Term(emptyComplex(),power);
}

Polynomial emptyPolynomial(){
    return Polynomial(
        emptyTerm(5),
        emptyTerm(4),
        emptyTerm(3),
        emptyTerm(2),
        emptyTerm(1),
        emptyTerm(0),
        0
    );
}

// int getDegree(Polynomial p){
//     return p.degree;
// }

Polynomial setDegree(Polynomial p){
    // Polynomial p = emptyPolynomial();
    if (p.degree > 5 || p.degree < 0){
        p.degree = -1;
        return p;
    }

    if (p.leading.c.realValue.value != 0. || p.leading.c.imaginaryValue.value != 0.){
        p.degree = 5;
        return p;
    }
    else if (p.x4.c.realValue.value != 0. || p.x4.c.imaginaryValue.value != 0.){
        p.degree = 4;
        return p;
    }
    else if (p.x3.c.realValue.value != 0. || p.x3.c.imaginaryValue.value != 0.){
        p.degree = 3;
        return p;
    }
    else if (p.x2.c.realValue.value != 0. || p.x2.c.imaginaryValue.value != 0.){
        p.degree = 2;
        return p;
    }
    else if (p.x.c.realValue.value != 0. || p.x.c.imaginaryValue.value != 0.){
        p.degree = 1;
        return p;  
    }
    else{
        p.degree = 0;
        return p;
    }
}

Term getTerm(Polynomial p, int degree){
    if (degree > 5 || degree < 0){
        return emptyTerm(-1);
    }

    if (degree == 5){
        return p.leading;
    }
    if (degree == 4){
        return p.x4;
    }
    if (degree == 3){
        return p.x3;
    }
    if (degree == 2){
        return p.x2;
    }
    if (degree == 1){
        return p.x;
    }
    if (degree == 0){
        return p.constant;
    }
}

Polynomial setTerm(Polynomial p, Term t){
    if (t.degree > 5 || t.degree < 0){
        return p;
    }

    if (t.degree == 5){
        p.leading = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 4){
        p.x4 = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 3){
        p.x3 = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 2){
        p.x2 = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 1){
        p.x = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 0){
        p.constant = t;
        p = setDegree(p);
        return p;
    }
}

// Polynomial addTerms(Term a, Term b){
//     Term term;
//     Polynomial polynomial = emptyPolynomial();
//     if (a.degree == b.degree){
//         term = Term(addComplex(a.c,b.c),a.degree);
//     }

//     setTerm(polynomial, term);
//     polynomial = setDegree(polynomial);
//     return polynomial;
// }

// Polynomial rootToPolynomial(Root root){
//     Polynomial p = emptyPolynomial();
//     Term x = Term(Complex(Real(1.),Imaginary(0.)),1);
//     Term C = Term(negate(root.c),0);
    
//     p = setTerm(p,x);
//     p = setTerm(p,C);
//     p = setDegree(p);
//     return p;
// }

Polynomial termToPolynomial(Term t){
    Polynomial p = emptyPolynomial();
    p = setTerm(p,t);
    p = setDegree(p);
    return p;
}

Polynomial addPolynomials(Polynomial a, Polynomial b){
    Polynomial sum = emptyPolynomial();
    for (int i = 0; i < 5; i ++){
        Term termA = getTerm(a,i);
        Term termB = getTerm(b,i);
        Term termSum = Term(addComplex(termA.c,termB.c),i);
        sum = setTerm(sum,termSum);
    }
    sum = setDegree(sum);
    return sum;
}

//multiply (x-a)(x-b)
Polynomial multiplyRoots(Root a, Root b){
    Term leading = Term(Complex(Real(1.),Imaginary(0.)),2);
    Term middle = Term(negate(addComplex(a.c,b.c)),1);
    Term constant = Term(multiplyComplex(negate(a.c),negate(b.c)), 0);

    Polynomial p = emptyPolynomial();
    p = addPolynomials(p,termToPolynomial(leading));
    p = addPolynomials(p,termToPolynomial(middle));
    p = addPolynomials(p,termToPolynomial(constant));
    p = setDegree(p);
    return p;
}


Polynomial multiplyPolynomial(Polynomial a, Root b){    
    Polynomial p = emptyPolynomial();

    Polynomial firstOperation = emptyPolynomial();
    for (int i = 5; i >= 0; i--){
        Term product = getTerm(a,i);
        product.degree += 1;//multiplication by x
        firstOperation = setTerm(firstOperation,product); 
    }
    Polynomial secondOperation = emptyPolynomial();
    for (int i = 5; i >= 0; i--){
        Term product = Term(multiplyComplex(negate(b.c), getTerm(a,i).c),i);
        secondOperation = setTerm(secondOperation, product);
    }

    p = addPolynomials(firstOperation, secondOperation);
    p = setDegree(p);
    return p;
}

Term powerRule(Term t){
    if (t.degree == 0){
        return emptyTerm(-1);// since setTerm doesnt take values below 0, this will be fine
    }
    Complex scalar = emptyComplex();
    scalar.realValue.value = float(t.degree);
    Term new = Term(multiplyComplex(t.c, scalar), t.degree - 1);
    
    return new;
}

Polynomial Differentiate(Polynomial p){
    Polynomial derivative = emptyPolynomial();
    p.leading = emptyTerm(5);
    for (int i = 5; i >= 0; i--){
        Term term = getTerm(p,i);
        term = powerRule(term);
        derivative = setTerm(derivative,term);
    }
    return derivative;
}

// Polynomial createPolynomial(Root a){
//     return rootToPolynomial(a);
// }
// Polynomial createPolynomial(Root a, Root b){
//     return multiplyRoots(a,b);
// }
// Polynomial createPolynomial(Root a, Root b, Root c){
//     return (multiplyPolynomial(multiplyRoots(a,b),c));
// }
Polynomial createPolynomial(Root a, Root b, Root c, Root d){
    return multiplyPolynomial(multiplyPolynomial(multiplyRoots(a,b),c),d);
}

Polynomial createPolynomial(Root a, Root b, Root c, Root d, Root e){
    return multiplyPolynomial(multiplyPolynomial(multiplyPolynomial(multiplyRoots(a,b),c),d),e);
}
Root createRoot(float real, float imaginary){
    return Root(Complex(Real(real),Imaginary(imaginary)));
}

Complex evaluateTerm(Term t, Complex c){
    return multiplyComplex(t.c,powComplex(c,t.degree));
}

Complex evaluate(in Polynomial p, Complex c){
    Complex sum = emptyComplex();
    for (int i = 5; i >= 0; i--){
        sum = addComplex(sum, evaluateTerm(getTerm(p,i),c));
    }
    return sum;
}

vec3 rgb(int r, int g, int b){
    return vec3(float(r)/255., float(g)/255., float(b)/255. );
}

vec3 NewtonsMethod(Complex complexCoord, Root a, Root b, Root c, Root d, Root e){
    Polynomial P = createPolynomial(a,b,c,d,e);
    P = createPolynomial(b,c,d,e);
    // P = createPolynomial(a,b,c,d);
    // P = createPolynomial(a,b,c);

    vec3 colorA = rgb(113,128,172);
    vec3 colorB = rgb(43,69,112);
    vec3 colorC = rgb(168,208,219);
    vec3 colorD = rgb(228,146,115);
    vec3 colorE = rgb(163,122,116);

    const int iterationLimit = 20;
    Complex z = complexCoord;
    for (int i = 0; i < iterationLimit; i++){
        z = subtractComplex(z,divideComplex(
            evaluate(P,z),
            evaluate(Differentiate(P),z)
        ));
    }

    // z = evaluate(P,z);
    
    // float distA = complexLength(subtractComplex(z,a.c));
    float distB = complexLength(subtractComplex(z,b.c));
    float distC = complexLength(subtractComplex(z,c.c));
    float distD = complexLength(subtractComplex(z,d.c));
    float distE = complexLength(subtractComplex(z,e.c));
    // float minDist = min(min(min(distA,distB),distC),distD);
    float minDist = min(min(min(distB,distC),distD),distE);

    // float minDist = min(min(min(min(distA,distB),distC),distD),distE);

    // if (minDist == distA){
    //     return colorA;
    // }
    // else 
    if (minDist == distB){
        return colorB;
    }
    else if(minDist == distC){
        return colorC;
    }
    else if(minDist == distD){
        return colorD;
    }
    else if (minDist == distE){
        return colorE;
    }

    // return vec3(z.realValue.value, z.imaginaryValue.value,0);
}

vec3 graph(vec2 uv){
    Complex complexCoord = Complex(Real(uv.x),Imaginary(uv.y));

    Root a = createRoot(6.0,0.0);
    Root b = createRoot(-6.,-3.0 - sin(u_time));
    Root c = createRoot(-6.,3.0 + 1.1 * sin( 0.5 * u_time));
    Root d = createRoot(2. + 2. * cos(u_time * 0.5),4. - sin(u_time * 2.));
    Root e = createRoot(2. + 2. * cos(u_time * 0.6),-4. + sin(u_time * 0.3));


    if (complexDistance(complexCoord,emptyComplex()) < 0.2){
        return vec3(1.0, 0.4706, 0.4706);
    }
    // if (complexDistance(complexCoord,a.c) < 0.1){
    //     return vec3(1,1,1);
    // }
    if (complexDistance(complexCoord,b.c) < 0.1){
        return vec3(1,1,1);
    }
    if (complexDistance(complexCoord,c.c) < 0.1){
        return vec3(1,1,1);
    }    
    if (complexDistance(complexCoord,d.c) < 0.1){
        return vec3(1,1,1);
    }    
    if (complexDistance(complexCoord,e.c) < 0.1){
        return vec3(1,1,1);
    }

    return NewtonsMethod(complexCoord, a,b,c,d,e);
    // return NewtonsMethod(complexCoord,P);
}

void main(){
    vec2 uv = vec2(2. * (gl_FragCoord.xy/ u_resolution)-1.);

    float graphScale = 15.;
    vec2 cameraPos = vec2(-0,0.025);
    //* (1./exp(0.4 * u_time))
    vec2 cameraView = (graphScale * (1./exp(0.4 * u_time))) * uv + cameraPos;
    cameraView = (graphScale) * uv + cameraPos;
    vec3 color = graph(cameraView);

    gl_FragColor = vec4(color,1.);
}