package eu.simpaticoproject.adaptation;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SimpaticoApplication.class)
@WebAppConfiguration
public class SimpaticoAdaptationEnginesApplicationTest {

	@Test
	public void contextLoads() {
		Assert.assertTrue(true);
	}

}
