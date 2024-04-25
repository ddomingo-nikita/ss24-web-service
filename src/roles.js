const ROLE_PARENT = "parent"
const ROLE_CHILD = "child"


export function isParent(request, response, nex){
    if(request.user && request.user.roles.include(ROLE_PARENT)){
        return next()
    }
    else{
        return response.status(401).send('Unauthorized')
    }
}


export function isChild(request, response, nex){
    if(request.user && request.user.roles.include(ROLE_CHILD)){
        return next()
    }
    else{
        return response.status(401).send('Unauthorized')
    }
}