def classify_scope(material: str):

    material = material.lower()

    if material in ["diesel"]:
        return "Scope 1"

    if material in ["electricity"]:
        return "Scope 2"

    return "Scope 3"
