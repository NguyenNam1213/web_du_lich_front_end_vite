import { useRoutes } from "react-router-dom";
import { routeSupplier } from "../../routes/supplier";

function AllRouter() {
    const elements = useRoutes([
        ...routeSupplier
    ]);

    return (
        <>
            {elements}
        </>
    )
}

export default AllRouter;