/* eslint-disable no-lone-blocks */
import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
{
	/* =============Dashboard============= */
}
const Dashboard = lazy(() => import("../dashboard/Dashboard"));

const Error403 = lazy(() => import("../common/Error403"));

const ListUser = lazy(() =>
	import('../user/ListUser')
);
const ProductList = lazy(() =>
	import('../product/ProductList')
);
const ListSize = lazy(() =>
	import('../product/SizeList')
);
const AddUser = lazy(() =>
	import('../user/AddUser')
);
const ProductManufacturer = lazy(() =>
	import('../productmanufacturer/ProductManufacturerList')
);
export default function HomePage() {
	return (
		<Suspense fallback={<LayoutSplashScreen />}>
			<Switch>
				{
					<Redirect exact from="/" to="/dashboard" />
				}
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/Error403" component={Error403} />
				<Route path="/User/List" component={ListUser} />
				<Route path="/User/AddNew" component={AddUser} />
				<Route path="/ProductManufacturer/ProductManufacturerList" component={ProductManufacturer}/>
				<Route path="/Product/SizeList" component={ListSize}/>
				<Route path="/Product/ProductList" component={ProductList}/>
			</Switch>
		</Suspense >
	);
}

