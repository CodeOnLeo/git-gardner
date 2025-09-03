package kr.co.gitgardner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Map<String, Object> envProps = loadEnvFile();
		
		SpringApplication app = new SpringApplication(BackendApplication.class);
		app.setDefaultProperties(envProps);
		app.run(args);
	}
	
	private static Map<String, Object> loadEnvFile() {
		Map<String, Object> props = new HashMap<>();
		try (BufferedReader reader = new BufferedReader(new FileReader("backend/.env"))) {
			String line;
			while ((line = reader.readLine()) != null) {
				if (line.trim().isEmpty() || line.startsWith("#")) {
					continue;
				}
				int equalIndex = line.indexOf('=');
				if (equalIndex > 0) {
					String key = line.substring(0, equalIndex).trim();
					String value = line.substring(equalIndex + 1).trim();
					if (value.startsWith("\"") && value.endsWith("\"")) {
						value = value.substring(1, value.length() - 1);
					}
					props.put(key, value);
				}
			}
		} catch (IOException e) {
			System.err.println("Could not load .env file: " + e.getMessage());
		}
		return props;
	}

}
